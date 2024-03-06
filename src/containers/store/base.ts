import { deepEqual } from '@/util';

type StoreListener = () => void;

// store value must be a primitive type or plain object or array of plain object
export class BaseStore<T> {
  private listeners: StoreListener[] = [];
  private state: T;
  constructor(initValue: T) {
    this.state = initValue;
  }
  // set array number boolean or plain object
  setState = (data: T): void => {
    // if (deepEqual(data, this.state)) {
    //   return;
    // }
    this.state = data;
    this.emitChange();
  };
  // set plain object
  mergeState = (data: Partial<T>): void => {
    const newState: T = {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...this.state,
      ...data,
    };
    if (deepEqual(newState, this.state)) {
      return;
    }
    this.state = newState;
    this.emitChange();
  };
  subscribe = (listener: StoreListener): StoreListener => {
    this.listeners = [...this.listeners, listener];
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  };
  getSnapshot = (): T => {
    return this.state;
  };
  private emitChange() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
