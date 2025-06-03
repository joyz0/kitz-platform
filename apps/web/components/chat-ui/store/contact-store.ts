import { RootStore } from './root-store';
import { flow, runInAction } from 'mobx';
import _ from 'lodash';
import { IMStore } from '../core/im-store';
import { waitFor } from '../utils';

export class ContactStore extends IMStore<RootStore> {
  contactMap: Map<string, any> = new Map();
  contactInfoMap: Map<string, any> = new Map();

  initialize = flow(function* (this: ContactStore) {
    try {
      yield Promise.all([
        waitFor(() => this.root.dbStore.status, 'ready'),
        waitFor(() => this.root.imStatus, 'ready'),
      ]);
      this.fetchAllContacts();
    } catch (error) {
      console.error('ContactStore init failed:', error);
    }
  });

  async fetchAllContacts() {
    try {
      const { data } = await this.root.imClient.getAllContacts!();
      console.log('>>>>>获取全部好友列表', data);
      if (data?.length > 0) {
        const toObj = _.keyBy(data, 'userId');
        const toMap = new Map(Object.entries(toObj));
        runInAction(() => {
          this.contactMap = toMap;
        });
      }
      const userIds = _.map(data, 'userId');
      this.getAllContactInfo(userIds);
    } catch (error) {
      console.error('好友列表获取失败', error);
    }
  }

  async getAllContactInfo(userIds: string[]) {
    let usersInfosObj = {};
    const requestTask: Promise<any>[] = [];
    const usersArr = _.chunk([...userIds], 99); //分拆users 用户属性获取一次不能超过100个
    try {
      usersArr.length > 0 &&
        usersArr.map((userItem) =>
          requestTask.push(this.root.imClient.fetchUserInfoById!(userItem)),
        );
      const result = await Promise.all(requestTask);
      const usersInfos = _.map(result, 'data');
      if (usersInfos.length > 0) {
        usersInfos.map(
          (item) => (usersInfosObj = Object.assign(usersInfosObj, item)),
        );
      }
      const userInfosToMap = new Map(Object.entries(usersInfosObj));
      runInAction(() => {
        if (this.contactInfoMap.size === 0) {
          this.contactInfoMap = userInfosToMap;
        } else {
          this.contactInfoMap = new Map([
            ...this.contactInfoMap,
            ...userInfosToMap,
          ]);
        }
      });
    } catch (error) {
      console.error('>>>获取联系人用户属性失败', error);
    }
  }
}
