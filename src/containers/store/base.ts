import { deepEqual } from '@/util';

type StoreListener = () => void;
type PrimitiveType = boolean | number | string | null | undefined;
type PlainObject = Record<string, PrimitiveType>;
type BaseStoreType = PrimitiveType | PlainObject | PlainObject[];

// store value must be a primitive type or plain object or array of plain object
export class BaseStore<T extends BaseStoreType> {
  private listeners: StoreListener[] = [];
  private state: T;
  constructor(initValue: T) {
    this.state = initValue;
  }
  // set array number boolean or plain object
  setState = (data: T) => {
    if (deepEqual(data, this.state)) {
      return;
    }
    this.state = data;
    this.emitChange();
  };
  // set plain object
  mergeState = (data: Partial<T>) => {
    const newState: T = {
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
