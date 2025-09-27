import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findMenuItem(menu: any[], url: string, parent?: any): any {
  for (const item of menu) {
    if (item.url === url) {
      if (parent) parent.isActive = true;
      return { title: item.title, url: item.url };
    }
    if (item.items && Array.isArray(item.items)) {
      const result = findMenuItem(item.items, url, item);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export const setLocal = (key: string, value: string, ttl?: number) => {
  if (!value) return;
  const item = {
    value,
    expiry: ttl ? Date.now() + ttl : undefined,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getLocal = (key: string) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  const item = JSON.parse(itemStr);
  if (item.expiry && Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

// ProTable参数转换工具类
export class ProTableUtils {
  /**
   * 将ProTable的params、sort、filter参数转换为后端DTO格式
   * @param params ProTable的查询参数
   * @param sort ProTable的排序参数
   * @param filter ProTable的过滤参数
   * @param options 转换选项
   * @returns 转换后的查询参数
   */
  static transformParams(
    params: Record<string, any>,
    sort: Record<string, any>,
    filter: Record<string, any>,
    options: {
      defaultPageSize?: number;
      defaultSortBy?: string;
      defaultSortOrder?: 'ascend' | 'descend';
    } = {}
  ) {
    const {
      defaultPageSize = 10,
      defaultSortBy = 'createdAt',
      defaultSortOrder = 'descend'
    } = options;

    // 基础查询参数转换
    const queryParams: any = {
      ...params,
      pageNo: params.current || 1,  // current -> pageNo
      pageSize: params.pageSize || defaultPageSize,
    };

    // 删除ProTable的current参数，避免重复
    delete queryParams.current;

    // 处理排序参数
    if (sort && Object.keys(sort).length > 0) {
      queryParams.sortBy = Object.keys(sort)[0];
      queryParams.sortOrder = Object.values(sort)[0];
    } else {
      queryParams.sortBy = defaultSortBy;
      queryParams.sortOrder = defaultSortOrder;
    }

    // 处理筛选参数（如果需要的话）
    if (filter && Object.keys(filter).length > 0) {
      Object.assign(queryParams, filter);
    }

    return queryParams;
  }

  /**
   * 创建ProTable的request函数
   * @param requestFunction 请求函数，接收转换后的参数并返回Promise
   * @param options 转换选项
   * @returns ProTable的request函数
   */
  static createRequestFunction(
    requestFunction: (params: any) => Promise<any>,
    options: {
      defaultPageSize?: number;
      defaultSortBy?: string;
      defaultSortOrder?: 'ascend' | 'descend';
      onParamsTransform?: (params: any) => any;
    } = {}
  ) {
    return async (params: any, sort: any, filter: any) => {
      console.log('ProTable params:', params, sort, filter);

      let queryParams = ProTableUtils.transformParams(params, sort, filter, options);

      // 允许自定义参数转换
      if (options.onParamsTransform) {
        queryParams = options.onParamsTransform(queryParams);
      }

      try {
        const response = await requestFunction(queryParams);

        // 检查响应结构并转换为ProTable期望的格式
        if (response && response.data && response.data.items && response.data.meta) {
          // 适配PaginatedApiResponse结构
          return {
            data: response.data.items,
            total: response.data.meta.total,
            success: response.ok || true,
          };
        } else if (response && response.data && Array.isArray(response.data)) {
          // 适配普通数组响应
          return {
            data: response.data,
            total: response.data.length,
            success: response.ok || true,
          };
        } else if (response && Array.isArray(response)) {
          // 直接是数组的情况
          return {
            data: response,
            total: response.length,
            success: true,
          };
        } else {
          // 其他情况，尝试直接返回
          console.warn('Unexpected response structure:', response);
          return {
            data: [],
            total: 0,
            success: false,
          };
        }
      } catch (error) {
        console.error('ProTable request error:', error);
        return {
          data: [],
          total: 0,
          success: false,
        };
      }
    };
  }
}

export class CookieUtil {
  // 获取 Cookie
  static get(name: string) {
    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName === encodeURIComponent(name) && cookieValue) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  }

  // 设置 Cookie
  static set(name: string, value: string, options: any = {}) {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.path) cookie += `; path=${options.path}`;
    if (options.domain) cookie += `; domain=${options.domain}`;
    if (options.maxAge) cookie += `; max-age=${options.maxAge}`;
    if (options.expires) cookie += `; expires=${options.expires.toUTCString()}`;
    if (options.secure) cookie += "; secure";
    if (options.sameSite) cookie += `; samesite=${options.sameSite}`;

    document.cookie = cookie;
  }

  // 删除 Cookie
  static delete(name: string) {
    this.set(name, "", {
      expires: new Date(0), // 设置为过去的时间
      path: "/", // 确保删除整个域下的 Cookie
    });
  }
}
