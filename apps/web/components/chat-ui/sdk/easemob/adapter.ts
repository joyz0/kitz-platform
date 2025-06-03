import MiniCore from 'easemob-websdk/miniCore/miniCore';
import * as contactPlugin from 'easemob-websdk/contact/contact';
import * as slientPlugin from 'easemob-websdk/silent/silent';
import * as groupPlugin from 'easemob-websdk/group/group';
import * as presencePlugin from 'easemob-websdk/presence/presence';
import * as localCachePlugin from 'easemob-websdk/localCache/localCache';
import { Request } from '@/lib/request';
import { IMAdapter, IMConnectOption } from '../../core/im-adapter';

export interface EasemobClient {
  user: string;
  usePlugin: (plugin: any, key?: string) => void;
  addEventHandler: (key: string, options: any) => void;
  open: (options: any) => void;
  getAllContacts?: () => any;
  fetchUserInfoById?: (ids: string | string[]) => any;
  getJoinedGroups?: (params: any) => any;
  getServerConversations?: (params: any) => any;
  modifyMessage?: (params: any) => Promise<any>;
  removeHistoryMessages?: (params: any) => Promise<any>;
  recallMessage?: (params: any) => Promise<any>;
  getHistoryMessages?: (params: any) => Promise<any>;
  slient?: {
    getSilentModeRemindTypeConversations?: (params: any) => any;
  };
  Message?: {
    create: (params: any) => any;
  };
}

export interface MessageEntity {
  chatType: 'singleChat' | 'groupChat' | string;
  ext?: any;
  from: string;
  id: string;
  msg: string;
  onlineState: number;
  serverMsgId: string;
  sessionId: string;
  status: number;
  time: number;
  to: string;
  type: 'txt' | 'img' | 'video' | 'audio';
  [s: string]: any;
}

export interface ConversationEntity {
  conversationId: string;
  conversationType: string;
  customField: any;
  lastMessageId: string;
  sessionId: string;
  unReadCount: number;
  updateTime: number;
  remindType?: string;
}

export class EasemobAdapter implements IMAdapter<EasemobClient> {
  client!: EasemobClient;

  async connect(options: IMConnectOption): Promise<EasemobClient> {
    const { data: userInfo } = await Request.get(options.secretUrl);
    this.client = new MiniCore({
      appKey: userInfo.appKey,
    });
    if (Object.keys(this.client).length) {
      //注册插件
      this.client.usePlugin(contactPlugin);
      this.client.usePlugin(groupPlugin);
      this.client.usePlugin(presencePlugin);
      this.client.usePlugin(slientPlugin, 'slient');
      this.client.usePlugin(localCachePlugin, 'localCache');
    }
    await this.client.open({
      username: userInfo.username,
      accessToken: userInfo.accessToken,
    });
    return this.client;
  }

  disconnect() {}
}
