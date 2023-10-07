import { assert } from '@/util';

type StoreListener = () => void;

export class BaseStore<T> {
  private listeners: StoreListener[] = [];
  private state: T;
  constructor(initValue: T) {
    this.state = initValue;
  }
  // set array number boolean
  setState(data: T) {
    this.state = data;
    this.emitChange();
  }
  // set object
  mergeState(data: Partial<T>) {
    const type = Object.prototype.toString.apply(data);
    assert(
      type === '[object Object]',
      'mergeState argument must be a plain object',
    );
    this.state = {
      ...this.state,
      ...data,
    };
    this.emitChange();
  }
  subscribe = (listener: StoreListener) => {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };
  getSnapshot = () => {
    return this.state;
  };
  private emitChange() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
