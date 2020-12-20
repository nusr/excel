function handleEvent(data?: any): void {
  console.log(data);
}
type HandleEvent = typeof handleEvent;
export class EventEmitter {
  protected event: Record<string, HandleEvent[]> = {};
  on(name: string, callback: HandleEvent): HandleEvent {
    if (!this.event[name]) {
      this.event[name] = [];
    }
    this.event[name].push(callback);
    return () => this.off(name, callback);
  }
  emit(name: string, data?: unknown): this {
    const list = this.event[name];
    if (!list || list.length <= 0) {
      return this;
    }
    for (const item of list) {
      item(data);
    }
    return this;
  }
  off(name: string, callback?: HandleEvent): this {
    const list = this.event[name];
    if (list) {
      if (callback) {
        this.event[name] = list.filter((v) => v !== callback);
      } else {
        delete this.event[name];
      }
    }
    return this;
  }
  offAll(): this {
    this.event = {};
    return this;
  }
  once(name: string, callback: HandleEvent): HandleEvent {
    const listener: HandleEvent = (data) => {
      this.off(name, listener);
      callback(data);
    };
    return this.on(name, listener);
  }
}
