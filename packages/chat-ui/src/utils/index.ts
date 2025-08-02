import { reaction } from 'mobx';

export function waitFor<T>(getter: () => T, targetValue: T, timeout = 5000) {
  return new Promise<void>((resolve, reject) => {
    if (getter() === targetValue) {
      resolve();
      return;
    }

    const dispose = reaction(
      getter,
      (value) => {
        if (value === targetValue) {
          dispose();
          resolve();
        }
      },
      { fireImmediately: true },
    );

    setTimeout(() => {
      dispose();
      reject(new Error(`聊天服务初始化异常`));
    }, timeout);
  });
}
