import { RootStore } from './root-store';
import { makeAutoObservable, runInAction } from 'mobx';

type IMConnectStatus = 'init' | 'ready' | 'error';

// 备用
export class MetaStore {
  imConnectStatus: IMConnectStatus = 'init';

  constructor(private rootStore: RootStore) {
    makeAutoObservable(this);
  }

  changeIMConnectStatus(payload: IMConnectStatus) {
    this.imConnectStatus = payload;
  }
}
