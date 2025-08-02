import { openDB, IDBPDatabase } from 'idb';
import { makeAutoObservable, runInAction } from 'mobx';
import { ConversationEntity, MessageEntity } from '../sdk/adapter';

export type DBSchema = {
  messages: {
    value: MessageEntity;
    key: string;
    indexes: {
      'by-sessionid': string;
      'by-time': number;
      'by-servermsgid': string;
      'by-sessiontime': [string, number];
    };
  };
  conversations: {
    value: ConversationEntity;
    key: string;
    indexes: { 'by-updatetime': number };
  };
};

type DBStoreStatus = 'init' | 'ready' | 'error';

export class DBStore {
  status: DBStoreStatus = 'init';
  db!: IDBPDatabase<DBSchema>;

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  private async initialize() {
    try {
      this.db = await openDB('chatDB', 2, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('messages')) {
            const table = db.createObjectStore('messages', {
              keyPath: 'id',
              // autoIncrement: true,
            });
            table.createIndex('by-sessionid', 'sessionId');
            table.createIndex('by-time', 'time');
            table.createIndex('by-servermsgid', 'serverMsgId');
            table.createIndex('by-sessiontime', ['sessionId', 'time']);
          }

          if (!db.objectStoreNames.contains('conversations')) {
            const table = db.createObjectStore('conversations', {
              keyPath: 'sessionId',
            });
            table.createIndex('by-updatetime', 'updateTime');
          }
        },
      });
      runInAction(() => (this.status = 'ready'));
    } catch (error) {
      runInAction(() => (this.status = 'error'));
      console.error('IDB init failed:', error);
    }
  }

  async get<T extends keyof DBSchema>(table: T, key: string) {
    return this.db.get(table, key);
  }

  async getAll<T extends keyof DBSchema>(table: T) {
    return this.db.getAll(table);
  }

  async add<T extends keyof DBSchema>(table: T, value: DBSchema[T]['value']) {
    return this.db.add(table, value);
  }

  async put<T extends keyof DBSchema>(table: T, value: DBSchema[T]['value']) {
    return this.db.put(table, value);
  }

  async delete<T extends keyof DBSchema>(table: T, key: string) {
    return this.db.delete(table, key);
  }

  async getByIndex<T extends keyof DBSchema>(
    table: T,
    indexName: any,
    value: any,
  ) {
    return this.db.getAllFromIndex(table, indexName, value);
  }
}
