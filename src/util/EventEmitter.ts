function handleEvent(data: any): void {
  console.log(data);
}
type HandleEvent = typeof handleEvent;
export class EventEmitter {
  protected event: Record<string, HandleEvent[]> = {};
  on<T>(name: string, callback: (data: T) => void): this {
    if (!this.event[name]) {
      this.event[name] = [];
    }
    this.event[name].push(callback);
    return this;
  }
  emit<T>(name: string, data?: T): this {
    const list = this.event[name];
    if (!list) {
      return this;
    }
    for (const item of list) {
      item(data);
    }
    return this;
  }
  off<T>(name: string, callback?: (data: T) => void): this {
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
  once<T>(name: string, callback: (data: T) => void): this {
    const listener = (data: T) => {
      this.off(name, listener);
      callback(data);
    };
    return this.on(name, listener);
  }
}
