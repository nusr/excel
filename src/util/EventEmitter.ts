/* eslint-disable @typescript-eslint/ban-ts-comment */
export class EventEmitter<
  EventType extends Record<string, unknown> = Record<string, unknown>
> {
  protected event: Record<string, Array<(...args: unknown[]) => void>> = {};
  getEventLength<T extends keyof EventType>(name: T): number {
    // @ts-ignore
    const temp = this.event[name];
    return (temp && temp.length) || 0;
  }
  on<T extends keyof EventType>(
    name: T,
    callback: (data: EventType[T]) => void
  ): VoidFunction {
    // @ts-ignore
    this.event[name] = this.event[name] || [];
    // @ts-ignore
    this.event[name].push(callback);
    return () => this.off(name, callback);
  }
  emitAsync<T extends keyof EventType>(name: T, data: EventType[T]): void {
    // @ts-ignore
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
  emit<T extends keyof EventType>(name: T, data: EventType[T]): void {
    // @ts-ignore
    const list = this.event[name];
    if (!list || list.length <= 0) {
      return;
    }
    for (const item of list) {
      item(data);
    }
  }
  off<T extends keyof EventType>(
    name: T,
    callback?: (data: EventType[T]) => void
  ): void {
    const result = [];
    // @ts-ignore
    const events = this.event[name];
    if (events && callback) {
      for (const item of events) {
        if (item !== callback && item._ !== callback) {
          result.push(item);
        }
      }
    }
    if (result.length) {
      // @ts-ignore
      this.event[name] = result;
    } else {
      // @ts-ignore
      delete this.event[name];
    }
  }
  offAll(): void {
    this.event = {};
  }
  once<T extends keyof EventType>(
    name: T,
    callback: (data: EventType[T]) => void
  ): VoidFunction {
    const listener = (data: EventType[T]) => {
      this.off(name, listener);
      callback(data);
    };
    listener._ = callback;
    return this.on(name, listener);
  }
}
