import { assert, isPlainObject } from '@/util';

type StoreListener = () => void;

export class BaseStore<T> {
  private listeners: StoreListener[] = [];
  private state: T;
  constructor(initValue: T) {
    this.state = initValue;
  }
  // set array number boolean or plain object
  setState(data: T) {
    this.state = data;
    this.emitChange();
  }
  // set plain object
  mergeState(data: Partial<T>) {
    assert(isPlainObject(data), 'mergeState argument must be a plain object');
    const newState: T = {
      ...this.state,
      ...data,
    };
    this.state = newState;
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
