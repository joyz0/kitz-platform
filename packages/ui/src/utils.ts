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
