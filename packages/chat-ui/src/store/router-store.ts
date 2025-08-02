import { RootStore } from './root-store';
import { IMStore } from '../core/im-store';
import { makeAutoObservable } from 'mobx';

// 定义路由类型和枚举
export type NavType = 'conversation' | 'contact' | 'group';

export enum NavEnum {
  CONVERSATION = 'conversation',
  CONTACT = 'contact',
  GROUP = 'group',
}

// 路由数据结构
export interface Route {
  nav: NavType;
  id?: string;
  params?: Record<string, string>;
}

export class RouterStore {
  readonly root: RootStore;
  // 当前路由状态
  route: Route = { nav: NavEnum.CONVERSATION };
  // 历史记录栈
  historyStack: Route[] = [];

  constructor(rootStore: RootStore) {
    this.root = rootStore;
    makeAutoObservable(this);
    this.initialize();
  }

  // 计算当前路由对应的hash
  get currentHash(): string {
    const { nav, id, params } = this.route;

    let hash = `#${nav}`;
    if (id) hash += `/${id}`;

    if (params) {
      const query = new URLSearchParams(params).toString();
      if (query) hash += `?${query}`;
    }

    return hash;
  }

  // 初始化路由状态
  initialize = () => {
    // 解析当前URL
    const currentRoute = this.parsePath(window.location.hash);
    this.route = currentRoute;
    // 监听URL变化
    window.addEventListener('hashchange', this.handleHashChange);
  };

  // 处理URL hash变化
  private handleHashChange = () => {
    const newRoute = this.parsePath(window.location.hash);
    this.replace(newRoute);
  };

  // 路径解析逻辑
  parsePath(path: string): Route {
    try {
      // 处理空路径
      if (!path || path === '#') {
        return { nav: NavEnum.CONVERSATION };
      }

      // 分割路径和查询参数
      const [hashPart, queryPart] = path.split('?');

      // 解析基本路径
      const cleanPath = hashPart!.replace(/^#/, '');
      const parts = cleanPath.split('/').filter(Boolean);

      // 解析导航类型（默认会话）
      const nav = Object.values(NavEnum).includes(parts[0] as NavEnum)
        ? (parts[0] as NavType)
        : NavEnum.CONVERSATION;

      // 解析ID（如果有）
      const id = parts[1];

      // 解析查询参数
      const params: Record<string, string> = {};
      if (queryPart) {
        new URLSearchParams(queryPart).forEach((value, key) => {
          params[key] = value;
        });
      }

      return { nav, id, params };
    } catch (error) {
      console.error('Failed to parse path:', error);
      return { nav: NavEnum.CONVERSATION };
    }
  }

  // 导航到新路由（添加到历史记录）
  push(newRoute: Route) {
    // 保存当前路由到历史栈
    this.historyStack = [...this.historyStack, this.route];

    // 更新当前路由
    this.route = { ...this.route, ...newRoute };

    // 更新URL
    window.location.hash = this.currentHash;

    // 特定路由的后处理
    this.handleRouteNavigation(newRoute);
  }

  // 替换当前路由（不添加到历史记录）
  replace(newRoute: Route) {
    // 更新当前路由
    this.route = { ...this.route, ...newRoute };

    // 更新URL（不触发hashchange事件）
    const currentHash = window.location.hash;
    const newHash = this.currentHash;

    if (currentHash !== newHash) {
      // 防止触发额外的hashchange事件
      window.removeEventListener('hashchange', this.handleHashChange);
      window.location.replace(newHash);
      setTimeout(() => {
        window.addEventListener('hashchange', this.handleHashChange);
      }, 0);
    }

    // 特定路由的后处理
    this.handleRouteNavigation(newRoute);
  }

  // 返回上一页
  navigateBack() {
    if (this.historyStack.length === 0) return;

    const previousRoute = this.historyStack[this.historyStack.length - 1];
    this.historyStack = this.historyStack.slice(0, -1);

    if (previousRoute) {
      this.route = previousRoute;
    }

    // 更新URL
    window.location.hash = this.currentHash;
  }

  // 特定路由的处理逻辑
  private handleRouteNavigation(route: Route) {
    const { nav, id } = route;

    // 根据路由类型执行不同的业务逻辑
    switch (nav) {
      case NavEnum.CONTACT:
        if (id) {
          // 加载联系人详情
          //   this.root.contactStore.loadContactDetails(id);
        }
        break;

      case NavEnum.GROUP:
        if (id) {
          // 加载群组信息
          //   this.root.groupStore.loadGroupDetails(id);
        }
        break;

      case NavEnum.CONVERSATION:
      default:
        // 清除当前选中的会话
        // this.root.conversationStore.setSelectedConversation(null);
        break;
    }
  }

  // 生成导航URL（可用于Link组件）
  buildNavUrl(
    nav: NavType,
    id?: string,
    params?: Record<string, string>,
  ): string {
    let url = `#${nav}`;
    if (id) url += `/${id}`;

    if (params) {
      const query = new URLSearchParams(params).toString();
      if (query) url += `?${query}`;
    }

    return url;
  }

  // 清理资源
  dispose() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }
}
