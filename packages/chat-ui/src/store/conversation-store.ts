import { flow, makeAutoObservable, reaction, runInAction } from 'mobx';
import { RootStore } from './root-store';
import { LRUCache } from 'lru-cache';
import _ from 'lodash';
import { ConversationEntity } from '../sdk/adapter';
import { waitFor } from '../utils';

const conversationCache = new LRUCache<string, ConversationEntity>({
  max: 1000,
  ttl: 60_000, // 1分钟缓存
});

export class ConversationStore {
  readonly root: RootStore;
  private syncDisposer: () => void;
  conversations: ConversationEntity[] = [];
  silentConversations: ConversationEntity[] = [];

  constructor(rootStore: RootStore) {
    this.root = rootStore;
    makeAutoObservable(this);
    this.initialize();
    this.syncDisposer = reaction(
      () => this.conversations.slice(),
      (conversations) => this.syncToIDB(conversations),
      { delay: 500 },
    );
  }

  get silentConversationIds() {
    return this.silentConversations
      .filter((item) => item.remindType?.toLocaleLowerCase() !== 'all')
      .map((item) => item.conversationId);
  }

  initialize = flow(function* (this: ConversationStore) {
    try {
      yield Promise.all([
        waitFor(() => this.root.dbStore.status, 'ready'),
        waitFor(() => Boolean(this.root.imClient), true),
      ]);
      this.fetchConversations();
      this.fetchSilentConversations();
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  });

  async fetchConversations() {
    try {
      let conversations = await this.root.dbStore.getAll('conversations');
      if (!conversations.length) {
        const result = await this.root.imClient.getServerConversations!({
          pageSize: 100,
          cursor: '',
        });
        if (result.data?.conversations?.length) {
          conversations = result.data.conversations;
        }
      }
      runInAction(() => {
        this.conversations = conversations;
      });
      //挑出为群聊的会话id，用于获取群聊详情
      //   const groupConversationIds = _.chain(conversations)
      //     .filter({ conversationType: CHAT_TYPE.GROUP })
      //     .map('conversationId')
      //     .value();
      //   this.fetchGroupDetailFromServer(groupConversationIds);
    } catch (error) {}
  }

  async fetchSilentConversations() {
    try {
      const result = await this.root.imClient.slient!
        .getSilentModeRemindTypeConversations!({ pageSize: 100 });
      runInAction(() => {
        if (result.data?.conversations?.length) {
          this.silentConversations = result.data.conversations;
        }
      });
    } catch (error) {}
  }

  private async syncToIDB(conversations: ConversationEntity[]) {
    try {
      const tx = this.root.dbStore.db.transaction('conversations', 'readwrite');
      const currentIDs = new Set(await tx.store.getAllKeys());

      for (const conversation of conversations) {
        if (currentIDs.has(conversation.sessionId)) {
          await tx.store.put(conversation);
        } else {
          await tx.store.add(conversation);
        }
        currentIDs.delete(conversation.sessionId);
      }

      for (const id of currentIDs) {
        await tx.store.delete(id);
      }

      await tx.done;
    } catch (error) {
      console.error('IDB sync failed:', error);
    }
  }

  async getConversation(id: string) {
    if (conversationCache.has(id)) {
      return conversationCache.get(id);
    }
    const conversation = await this.root.dbStore.get('conversations', id);
    conversationCache.set(id, conversation);
    return conversation;
  }

  async addConversation(conversation: ConversationEntity) {
    runInAction(() => this.conversations.push(conversation));
  }

  async updateConversation(conversation: ConversationEntity) {
    const index = this.conversations.findIndex(
      (c) => c.sessionId === conversation.sessionId,
    );
    if (index > -1) {
      runInAction(() => {
        this.conversations[index] = {
          ...this.conversations[index],
          ...conversation,
        };
      });
    }
  }

  async deleteConversation(id: string) {
    runInAction(() => {
      this.conversations = this.conversations.filter((m) => m.sessionId !== id);
    });
  }

  dispose() {
    this.syncDisposer();
  }
}
