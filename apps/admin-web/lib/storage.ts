export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('LocalStorage 解析失败', e);
      return null;
    }
  },

  set(key: string, value: unknown): void {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  },
};
