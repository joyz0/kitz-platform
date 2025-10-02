type EventHandler<T = any> = (data: T) => void;

export class EventBus {
  private events: { [key: string]: EventHandler[] } = {};
  private id = Date.now();

  constructor(private name: string) {
    console.log('event bus id', this.id);
  }

  // 订阅事件
  on<T>(event: string, handler: EventHandler<T>) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
    console.log('event bus on:', this.events);
  }

  // 取消订阅
  off(event: string, handler?: EventHandler) {
    if (!handler) {
      delete this.events[event];
      return;
    }
    const index = this.events[event]?.indexOf(handler);
    if (index !== undefined && index >= 0) {
      this.events[event]?.splice(index, 1);
    }
  }

  // 触发事件
  emit<T>(event: string, data?: T) {
    console.log('event bus emit:', this.events);
    this.events[event]?.forEach((handler) => handler(data));
  }

  clear() {
    this.events = {};
  }
}

export const CustomEventBus =
  typeof window === undefined
    ? new EventBus('ServerEventBus')
    : new EventBus('ClientEventBus');
