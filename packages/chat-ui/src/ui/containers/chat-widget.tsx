'use client';

import { useState, useRef, useEffect } from 'react';
import ChatWindow from './chat-window';

interface Position {
  name: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  button: string;
  chat: string;
  origin: string;
}

const positions: Record<string, Position> = {
  'bottom-right': {
    name: 'bottom-right',
    button: 'bottom-4 right-4',
    chat: 'bottom-[calc(100%+12px)] right-0 origin-bottom-right',
    origin: 'origin-bottom-right',
  },
  'bottom-left': {
    name: 'bottom-left',
    button: 'bottom-4 left-4',
    chat: 'bottom-[calc(100%+12px)] left-0 origin-bottom-left',
    origin: 'origin-bottom-left',
  },
  'top-right': {
    name: 'top-right',
    button: 'top-4 right-4',
    chat: 'top-[calc(100%+12px)] right-0 origin-top-right',
    origin: 'origin-top-right',
  },
  'top-left': {
    name: 'top-left',
    button: 'top-4 left-4',
    chat: 'top-[calc(100%+12px)] left-0 origin-top-left',
    origin: 'origin-top-left',
  },
};

export interface ChatWidgetProps {
  loading?: boolean;
  config?: {
    appKey: string;
    username: string;
    accessToken: string;
  };
  position?: keyof typeof positions;
  onOpen?: () => void;
  onClose?: () => void;
}

export default function ChatWidget({
  loading = false,
  config,
  position = 'bottom-right',
  onOpen,
  onClose,
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<Position>(
    positions[position]!,
  );
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (positions[position]!.name !== currentPosition.name) {
      setIsAnimating(true);

      buttonRef.current?.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0.5, transform: 'scale(0.5)', offset: 0.3 },
          { opacity: 1, transform: 'scale(1)' },
        ],
        {
          duration: 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
      );

      const timer = setTimeout(() => {
        setCurrentPosition(positions[position]!);
        setIsAnimating(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [position, currentPosition.name]);

  const handleButtonClick = () => {
    if (loading || isAnimating) return;

    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  };

  const openChat = () => {
    if (config) {
      setIsAnimating(true);
      setIsOpen(true);

      setTimeout(() => {
        onOpen?.();
        setIsAnimating(false);
      }, 300);
    }
  };

  const closeChat = () => {
    setIsAnimating(true);

    setTimeout(() => {
      setIsOpen(false);
      onClose?.();
      setIsAnimating(false);
    }, 200);
  };

  const { button, chat, origin } = currentPosition;

  return (
    <div
      className={`fixed ${button} z-50 flex flex-col items-end transition-all duration-500`}
    >
      {isOpen && (
        <div
          className={`absolute ${chat} w-80 h-[480px] rounded-lg overflow-hidden shadow-xl transition-all duration-300 transform-gpu ${origin} ${isOpen ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
          style={{
            transformOrigin: origin,
          }}
        >
          <ChatWindow onClose={closeChat} />
        </div>
      )}

      <div
        ref={buttonRef}
        onClick={handleButtonClick}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center 
          shadow-lg cursor-pointer transition-all duration-300
          ${loading ? 'bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'}
          ${isAnimating ? 'animate-pulse' : ''}
          transform ${isOpen ? 'rotate-[360deg]' : 'rotate-0'}
        `}
      >
        {loading ? (
          <div className="relative w-6 h-6">
            <div className="absolute inset-0 animate-spin">
              <svg viewBox="0 0 24 24" className="w-full h-full text-white">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="80"
                  strokeDashoffset="60"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div
            className={`text-white transition-all ${isOpen ? 'scale-125' : 'scale-100'}`}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}

        {/* 消息提示动画 */}
        {!isOpen && !loading && config && (
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
            <div className="relative">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative h-3 w-3 rounded-full bg-red-500"></span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
