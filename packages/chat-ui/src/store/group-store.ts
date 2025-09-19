import { RootStore } from './root-store';
import { flow, makeAutoObservable, runInAction } from 'mobx';
import _ from 'lodash';
import { waitFor } from '../utils';

export class GroupStore {
  readonly root: RootStore;
  groups: any[] = [];

  constructor(rootStore: RootStore) {
    this.root = rootStore;
    makeAutoObservable(this);
    this.initialize();
  }

  initialize = flow(function* (this: GroupStore) {
    try {
      yield Promise.all([
        waitFor(() => this.root.dbStore.status, 'ready'),
        waitFor(() => Boolean(this.root.imClient), true),
      ]);
      this.fetchChuckGroups();
    } catch (error) {
      console.error('GroupStore init failed:', error);
    }
  });

  async fetchChuckGroups(pageNo = 1, pageSize = 20) {
    try {
      const { total, entities } = await this.root.imClient.getJoinedGroups!({
        pageNum: pageNo,
        pageSize,
        needAffiliations: true,
        needRole: true,
      });
      if (entities?.length === 0) {
        return;
      }
      runInAction(() => {
        this.groups = _.unionBy(
          [...this.groups],
          [...entities],
          (g) => g.groupId,
        );
      });
      if (entities?.length > 0) {
        this.fetchChuckGroups(pageNo + 1, pageNo);
      }
    } catch (error) {
      console.error('加入的群聊列表获取失败', error);
    }
  }
}
