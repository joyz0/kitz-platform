import { makeAutoObservable } from 'mobx';

/**
 * @deprecated
 */
export abstract class IMStore<T> {
  protected readonly root: T;

  constructor(rootStore: T) {
    this.root = rootStore;
    makeAutoObservable(this); // 自动响应式转换
    this.initialize(); // 自动调用初始化
  }

  protected initialize(): void | Promise<void> {
    // 可选：由子类实现的初始化逻辑
  }
}
