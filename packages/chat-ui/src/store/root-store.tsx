import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { MetaStore } from './meta-store';
import { makeAutoObservable, reaction, runInAction } from 'mobx';
import { DBStore } from './db-store';
import { MessageStore } from './message-store';
import { ConversationStore } from './conversation-store';
import { ContactStore } from './contact-store';
import { GroupStore } from './group-store';
import { IMAdapter, IMClient, MessageEntity } from '../sdk/adapter';
import { CHAT_TYPE, ERRORS } from '../sdk/constant';
import { waitFor } from '../utils';
import { RouterStore } from './router-store';
import { IMConnectOption } from '../core/im-adapter';

type IMStoreStatus = 'init' | 'ready' | 'error';

export class RootStore<T = any> {
  imClient!: IMClient;
  imStatus: IMStoreStatus = 'init';
  imNetworkStatus: IMStoreStatus = 'init';
  imUser: any;
  dbStore!: DBStore;
  router!: RouterStore;
  metaStore!: MetaStore;
  messageStore!: MessageStore;
  conversationStore!: ConversationStore;
  contactStore!: ContactStore;
  groupStore!: GroupStore;

  constructor(props: IMConnectOption<T>) {
    makeAutoObservable(this);
    this.initialize(props);
  }

  private async initialize(props: IMConnectOption<T>) {
    this.dbStore = new DBStore();
    this.router = new RouterStore(this);
    this.metaStore = new MetaStore(this);
    this.messageStore = new MessageStore(this);
    this.conversationStore = new ConversationStore(this);
    this.contactStore = new ContactStore(this);
    this.groupStore = new GroupStore(this);

    reaction(
      () => this.dbStore.status,
      (status) => {
        if (status === 'error') {
          // 触发错误处理逻辑
        }
      },
    );

    const adapter = new IMAdapter();
    console.log(111, props);
    this.imClient = await adapter.connect({
      ...props,
      beforeConnect: (client) => {
        this.mountListeners(client);
      },
    });

    await Promise.all([
      waitFor(() => this.dbStore.status, 'ready'),
      waitFor(() => this.imStatus, 'ready'),
    ]);

    this.fetchIMUser(this.imClient.user);
  }

  private async fetchIMUser(userId: string) {
    try {
      const { data } = await this.imClient.fetchUserInfoById!(userId);
      data[userId].hxId = userId;
      runInAction(() => {
        this.imUser = Object.assign(this.imUser, data[userId]);
      });
    } catch (error) {
      console.error('IM SDK getUserInfo failed:', error);
    }
  }

  private mountListeners(client: IMClient) {
    client.addEventHandler('connection', {
      onConnected: () => {
        runInAction(() => (this.imStatus = 'ready'));
      },
      onDisconnected: () => {
        runInAction(() => (this.imStatus = 'init'));
      },
      onOnline: () => {
        runInAction(() => (this.imNetworkStatus = 'ready'));
      },
      onOffline: () => {
        runInAction(() => (this.imNetworkStatus = 'init'));
      },
      onError: (error: any) => {
        this.onError(error.type, error.message);
      },
      onMultiDeviceEvent: () => {
        this.conversationStore.fetchSilentConversations();
      },
    });
    // 处理登陆用户状态的变更
    // this.client.addEventHandler('presenceStatusChange', {
    //   onPresenceStatusChange: (status: any) => {
    //     getUserPresence(status);
    //   },
    // });
    client.addEventHandler('messageListen', {
      onTextMessage: function (message: MessageEntity) {
        this.rootStore.messageStore.addMessage(message);
      }, // 收到文本消息。
      onEmojiMessage: function (message: MessageEntity) {
        this.rootStore.messageStore.addMessage(message);
      }, // 收到表情消息。
      onImageMessage: function (message: MessageEntity) {
        this.rootStore.messageStore.addMessage(message);
      }, // 收到图片消息。
      onCmdMessage: function (message: MessageEntity) {
        this.rootStore.messageStore.addMessage(message);
      }, // 收到命令消息。
      onAudioMessage: function (message: MessageEntity) {
        this.rootStore.messageStore.addMessage(message);
      }, // 收到音频消息。
      onLocationMessage: function (message: MessageEntity) {
        this.rootStore.messageStore.addMessage(message);
      }, // 收到位置消息。
      onFileMessage: function (message: MessageEntity) {
        this.rootStore.messageStore.addMessage(message);
      }, // 收到文件消息。
      onCustomMessage: function (message: MessageEntity) {
        this.rootStore.messageStore.addMessage(message);
      }, // 收到自定义消息。
      onVideoMessage: function (message: MessageEntity) {
        this.rootStore.messageStore.addMessage(message);
      }, // 收到视频消息。
      onRecallMessage: function (message: MessageEntity) {
        const { from, to } = message;
        message.to === this.client.user ? from : to;
        message.chatType =
          to === this.client.user ? CHAT_TYPE.SINGLE : CHAT_TYPE.GROUP;
        this.rootStore.messageStore.recallMessage(message, true);
      }, // 收到消息撤回回执。
      onModifiedMessage: function (message: MessageEntity) {
        const { from, to } = message;
        //单对单的撤回to必然为登陆的用户id，群聊发起撤回to必然为群聊id 所以key可以这样来区分群聊或者单人。
        if (!to) return;
        message.to = to === this.client.user ? from : to;
        this.rootStore.messageStore.modifyMessage(message, true);
      },
    });
    client.addEventHandler('friendListen', {
      // 收到好友邀请触发此方法。
      onContactInvited: (data: any) => {},
      // 联系人被删除时触发此方法。
      onContactDeleted: (data: any) => {},
      // 新增联系人会触发此方法。
      onContactAdded: (data: any) => {},
      // 好友请求被拒绝时触发此方法。
      onContactRefuse: (data: any) => {},
      // 好友请求被同意时触发此方法。
      onContactAgreed: (data: any) => {},
    });
    // mountGroupEventListener();
    // mountReadAckEventListener();
  }

  private onError(code: number, errorDesc = '') {
    //针对触发Moderation的消息做特别处理
    if (code === 508) {
      errorDesc = 'moderation';
    }
    if (code === 507) {
      errorDesc = 'muted';
    }

    const message = (ERRORS[code] && ERRORS[code][errorDesc]) || errorDesc;
    console.error('IM SDK init failed:', message);
  }

  // 按需加载的 Store
  // private _analyticStore?: AnalyticStore;
  // get analyticStore() {
  //   return (this._analyticStore ||= new AnalyticStore(this));
  // }
}

export const RootStoreContext = createContext<RootStore | null>(null);

export const useRootStore = () => {
  const store = useContext(RootStoreContext);
  if (!store) throw new Error('必须在 Provider 内使用');
  return store;
};

export const useIMClient = () => useRootStore()!.imClient;
export const useDBStore = () => useRootStore()!.dbStore;
export const useRouter = () => useRootStore()!.router;
export const useMetaStore = () => useRootStore()!.metaStore;
export const useMessageStore = () => useRootStore()!.messageStore;
export const useConversationStore = () => useRootStore()!.conversationStore;
export const useContactStore = () => useRootStore()!.contactStore;
export const useGroupStore = () => useRootStore()!.groupStore;
