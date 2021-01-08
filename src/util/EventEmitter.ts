import { IEventEmitter, EventHandler } from "@/types";
export class EventEmitter implements IEventEmitter {
  protected event: Record<string, Array<EventHandler>> = {};
  on(name: string, callback: EventHandler): EventHandler {
    if (!this.event[name]) {
      this.event[name] = [];
    }
    this.event[name].push(callback);
    return () => this.off(name, callback);
  }
  emit(name: string, data?: unknown): void {
    const list = this.event[name];
    if (!list || list.length <= 0) {
      return;
    }
    for (const item of list) {
      window.requestAnimationFrame(() => {
        item(data);
      });
    }
  }
  emitAsync(name: string, data?: unknown): void {
    const list = this.event[name];
    if (!list || list.length <= 0) {
      return;
    }
    for (const item of list) {
      item(data);
    }
  }
  off(name: string, callback?: EventHandler): void {
    const list = this.event[name];
    if (list) {
      if (callback) {
        this.event[name] = list.filter((v: EventHandler) => v !== callback);
      } else {
        delete this.event[name];
      }
    }
  }
  offAll(): void {
    this.event = {};
  }
  once(name: string, callback: EventHandler): EventHandler {
    const listener: EventHandler = (data) => {
      this.off(name, listener);
      callback(data);
    };
    return this.on(name, listener);
  }
}
