import { flow, runInAction } from 'mobx';
import { RootStore } from './root-store';
import { CHAT_TYPE, MAX_MESSAGE_LIST_COUNT } from '../sdk/easemob/constant';
import _ from 'lodash';
import { MessageEntity } from '../sdk/adapter';
import { IMStore } from '../core/im-store';
import { waitFor } from '../utils';

interface UpdateMessagePayload {
  type: number;
  sessionId: string;
  messageId: string;
  message: MessageEntity;
}

export class MessageStore extends IMStore<RootStore> {
  sessionIdToMessageMap: Map<string, MessageEntity[]> = new Map();

  initialize = flow(function* (this: MessageStore) {
    try {
      yield Promise.all([
        waitFor(() => this.root.dbStore.status, 'ready'),
        waitFor(() => this.root.imStatus, 'ready'),
      ]);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  });

  getSessionId(msg: MessageEntity): string {
    const currentUserId = this.root.imClient.user;
    const sessionId =
      msg.chatType === CHAT_TYPE.SINGLE
        ? msg.to === currentUserId
          ? msg.from
          : msg.to
        : msg.to;

    return sessionId;
  }

  async getHistoryMessages(payload: any) {
    const { sessionId, chatType, cursor } = payload;
    const result = await this.root.imClient.getHistoryMessages!({
      targetId: sessionId,
      pageSize: 10,
      cursor,
      chatType,
      searchDirection: 'up',
    });
    result.messages?.forEach((item: MessageEntity) => {
      item.read = true;
    });
    const arr = this.sessionIdToMessageMap.get(sessionId) || [];
    this.sessionIdToMessageMap.set(
      sessionId,
      _.unionBy(_.reverse(result.messages), arr, (m) => m.id),
    );
    // todo
    // if (!this.sessionIdToMessageMap.has(sessionId)) {
    //   this.updateLocalConversation({
    //     conversationId: sessionId,
    //     chatType
    //   });
    // }
  }

  async addMessage(msg: MessageEntity) {
    runInAction(() => {
      const sessionId = this.getSessionId(msg);
      let arr = this.sessionIdToMessageMap.get(sessionId) || [];
      arr = _.unionBy(arr, [msg], (m) => m.id);
      // 限制数组的长度为 MAX_MESSAGE_LIST_COUNT
      if (arr.length > MAX_MESSAGE_LIST_COUNT) {
        arr = arr.slice(-MAX_MESSAGE_LIST_COUNT);
      }
      this.sessionIdToMessageMap.set(sessionId, arr);
    });
    this.root.dbStore.add('messages', msg);
    // todo
    // this.updateLocalConversation({
    //   conversationId: key,
    //   chatType: params.chatType,
    // });
  }

  // 只有txt消息可以修改
  async modifyMessage(payload: any, passive = false) {
    const { mid, to, chatType, msg } = payload;
    try {
      if (!passive) {
        const textMessage = this.root.imClient.Message!.create({
          type: 'txt',
          msg,
          to,
          chatType,
        });
        const { message } = await this.root.imClient.modifyMessage!({
          messageId: mid,
          modifiedMessage: textMessage,
        });
        payload = message;
      }
      const arr = this.sessionIdToMessageMap.get(to);
      const obj = _.find(arr, (o) => o.id === mid);
      _.assign(obj, payload);
      this.root.dbStore.put('messages', payload);
      // todo
      // this.updateLocalConversation({
      //   conversationId: to,
      //   chatType,
      // });
    } catch (error) {}
  }

  async removeMessage(payload: MessageEntity) {
    const { mid, chatType } = payload;
    try {
      const sessionId = this.getSessionId(payload);
      await this.root.imClient.removeHistoryMessages!({
        targetId: sessionId,
        chatType: chatType,
        messageIds: [mid],
      });
      const arr = this.sessionIdToMessageMap.get(sessionId)!;
      const index = _.findIndex(arr, (o) => o.id === mid);
      arr.splice(index, 1);
      this.sessionIdToMessageMap.set(sessionId, _.assign([], arr));
      this.root.dbStore.delete('messages', mid);
      // todo
      // this.updateLocalConversation({
      //   conversationId: key,
      //   chatType
      // });
    } catch (error) {}
  }

  //撤回消息
  async recallMessage(payload: any, passive = false) {
    const { mid, to, chatType } = payload;
    try {
      const task = passive
        ? Promise.resolve()
        : this.root.imClient.recallMessage!({ mid, to, chatType });
      await task;
      const arr = this.sessionIdToMessageMap.get(to);
      const msg = _.find(arr, (o) => o.id === mid);
      if (msg) {
        msg.isRecall = true;
        this.root.dbStore.put('messages', msg);
      }
      // todo
      // this.updateLocalConversation({
      //   conversationId: to,
      //   chatType,
      // });
    } catch (error) {}
  }
}
