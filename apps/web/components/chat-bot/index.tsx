'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { flushSync } from 'react-dom';
import clsx from 'clsx';
import useSWR from 'swr';
import { get, post } from '@/lib/request';
import { getLocal, setLocal } from '@repo/ui';
import {
  d_ignore,
  d_login,
  err_http,
  err_irrelevant,
  err_not_login,
} from './constant';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  nickname: string;
  timestamp: number;
  isTemp?: boolean;
}

// IndexedDB Schema定义
interface ChatDBSchema extends DBSchema {
  messages: {
    key: string;
    value: Message;
    indexes: { 'by-timestamp': number };
  };
}

type MessageType = 'text' | 'error' | 'directive' | 'media' | string;
interface MessageSchema {
  type: MessageType;
  query: string;
  answer: string;
  payload: any;
}

function buildMessageSchema(msg: string, parse = true): MessageSchema {
  let type: MessageType = 'text';
  let payload = null;
  if (msg.startsWith('err_')) {
    type = 'error';
  } else if (msg.startsWith('d_')) {
    type = 'directive';
  } else if (msg.startsWith('{')) {
    type = 'media';
    payload = parse ? JSON.parse(msg) : null;
  }
  return {
    type,
    query: '',
    answer: msg,
    payload,
  };
}

const TIME_INTERVAL = 5 * 60 * 1000; // 5分钟时间间隔
const PAGE_SIZE = 10; // 分页大小

const ChatBot = () => {
  // 组件状态
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dbRef = useRef<IDBPDatabase<ChatDBSchema>>(null);
  const conversationId = useRef<string>(null);

  async function connect() {
    const data = await post('/api/dify/connect', {
      conversation_id: conversationId.current || '',
    });
    if (!conversationId.current) {
      setLocal('dify_conversation_id', data.conversation_id);
      conversationId.current = data.conversation_id;
    }
    if (data.answer === d_ignore) {
      setConnected(true);
    }
  }

  // 初始化IndexedDB
  useEffect(() => {
    const initDB = async () => {
      const db = await openDB<ChatDBSchema>('chat-db', 1, {
        upgrade(db) {
          const store = db.createObjectStore('messages', { keyPath: 'id' });
          store.createIndex('by-timestamp', 'timestamp');
        },
      });
      dbRef.current = db;
      conversationId.current = getLocal('dify_conversation_id');
      loadMessages();
    };
    initDB();
  }, []);

  // 加载消息（分页处理）
  const loadMessages = async (newPage = 1) => {
    if (!dbRef.current) return;

    setIsLoadingMore(true);
    const tx = dbRef.current.transaction('messages', 'readonly');
    const index = tx.store.index('by-timestamp');

    let cursor = await index.openCursor(null, 'prev');
    const results: Message[] = [];
    let count = 0;
    const offset = (newPage - 1) * PAGE_SIZE;

    // 使用cursor.advance跳过已加载的记录
    if (offset > 0 && cursor) {
      cursor = await cursor.advance(offset);
    }

    // 遍历游标获取数据
    while (cursor && count < PAGE_SIZE) {
      results.push(cursor.value);
      count++;
      cursor = await cursor.continue();
    }

    setHasMore(results.length === PAGE_SIZE);
    setMessages((prev) => [...results.reverse(), ...prev]);
    setPage(newPage);
    // setIsLoadingMore(false);
  };

  // 保存消息到数据库
  const saveMessage = async (message: Message) => {
    if (!dbRef.current) return;
    await dbRef.current.put('messages', message);
  };

  // 滚动到底部（带平滑动画）
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen && !isLoadingMore) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoadingMore, scrollToBottom]);

  const getTimeString = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 判断是否需要显示时间
  const shouldShowTime = (current: Message, prev?: Message) => {
    if (!prev) return true;
    return current.timestamp - prev.timestamp > TIME_INTERVAL;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;

    setIsSending(true);

    // 用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      nickname: '我',
      timestamp: Date.now(),
    };

    const querySchema = buildMessageSchema(userMessage.content, false);

    // 临时机器人消息
    const tempBotMessage: Message = {
      id: `temp-${Date.now()}`,
      content: '正在思考中...',
      isUser: false,
      nickname: '智能助手',
      timestamp: Date.now(),
      isTemp: true,
    };

    // 更新消息列表
    if (querySchema.type === 'text') {
      setMessages((prev) => [...prev, userMessage, tempBotMessage]);
      setIsLoadingMore(false);
      await saveMessage(userMessage);
    }
    setInputMessage('');

    try {
      const data = await post('/api/dify/chat', {
        message: userMessage.content,
        conversation_id: conversationId.current || '',
      });
      if (!conversationId.current) {
        setLocal('dify_conversation_id', data.conversation_id);
        conversationId.current = data.conversation_id;
      }
      // 模拟5秒延迟的API请求
      // const data = await new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve({ reply: `这是对 "${inputMessage}" 的回复` });
      //   }, 5000);
      // });

      // 正式机器人消息
      const botMessage: Message = {
        id: data.message_id,
        content: data.answer,
        isUser: false,
        nickname: '智能助手',
        timestamp: data.created_at * 1000,
      };
      const answerSchema = buildMessageSchema(botMessage.content, false);

      // 替换临时消息
      if (querySchema.type === 'text' && answerSchema.type !== d_ignore) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempBotMessage.id ? botMessage : msg)),
        );
        await saveMessage(botMessage);
      }
    } catch (error) {
      // 错误处理
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempBotMessage.id
            ? { ...msg, content: '请求失败，请重试' }
            : msg,
        ),
      );
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleOpen = () => {
    if (!connected) {
      connect();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* 悬浮按钮 */}
      <button
        onClick={handleOpen}
        className="w-12 h-12 bg-blue-500 rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110"
      >
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {/* 聊天窗口 */}
      <div
        className={clsx(
          'absolute bottom-16 right-0 w-96 bg-white rounded-xl shadow-xl transform transition-all duration-300 origin-bottom-right',
          {
            hidden: !isOpen,
          },
        )}
      >
        {/* 头部 */}
        <div className="bg-blue-500 p-4 rounded-t-xl flex items-center justify-between">
          <h2 className="text-white text-lg font-semibold">智能助手</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-blue-200 transition-colors"
          >
            ×
          </button>
        </div>

        {/* 消息列表 */}
        <div className="h-96 overflow-y-auto p-4 space-y-2">
          {hasMore && (
            <button
              onClick={() => loadMessages(page + 1)}
              className="w-full text-center text-gray-500 hover:text-blue-500 text-sm
                           transition-colors"
            >
              加载更多...
            </button>
          )}

          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const showTime = shouldShowTime(message, prevMessage);

            return (
              <div key={message.id} className="space-y-2">
                {/* 时间显示 */}
                {showTime && (
                  <div className="text-center text-xs text-gray-500 py-2">
                    {getTimeString(message.timestamp)}
                  </div>
                )}

                {/* 消息内容 */}
                <div
                  className={`flex ${
                    message.isUser ? 'flex-row-reverse' : ''
                  } gap-3`}
                >
                  <img
                    src={
                      message.isUser
                        ? 'https://i.pravatar.cc/40?u=user'
                        : 'https://i.pravatar.cc/40?u=bot'
                    }
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />

                  <div>
                    <div
                      className={`text-xs text-gray-600 mb-1 ${
                        message.isUser ? 'text-right' : 'text-left'
                      }`}
                    >
                      {message.nickname}
                    </div>
                    <div
                      className={`max-w-48 p-3 rounded-lg transition-all duration-1000
                                   ${
                                     message.isUser
                                       ? 'bg-blue-500 text-white'
                                       : `bg-gray-100 ${
                                           message.isTemp
                                             ? 'animate-pulse italic'
                                             : ''
                                         }`
                                   }
                                   ${
                                     message.isUser
                                       ? 'hover:bg-blue-600'
                                       : 'hover:bg-gray-200'
                                   }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="p-4 border-t">
          <div className="px-4 py-2 border rounded-xl h-[126px]">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full overflow-auto h-[72px] whitespace-pre-wrap resize-none focus:outline-none"
              placeholder="请提问..."
            />
            <div className="flex justify-end">
              <button
                onClick={sendMessage}
                disabled={isSending || !connected}
                className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 
                         transition-colors duration-200 disabled:bg-gray-400 
                         disabled:cursor-not-allowed flex items-center justify-center"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
