export class BaseStore<T> {
  private listeners: Set<(state: T, prevState: T) => void> = new Set()
  private state: T;
  constructor(initValue: T) {
    this.state = initValue;
  }
  setState = (nextState: T | Partial<T>, replace?: boolean) => {
    if (Array.isArray(nextState)) {
      replace = true
    }
    // @ts-ignore
    const check = !replace && nextState && typeof nextState === 'object' && Object.entries(nextState).every(([key, value]) => Object.is(this.state[key], value));
    if (check) {
      return check
    }
    if (!Object.is(this.state, nextState)) {
      const previousState = this.state;
      this.state = (replace ?? (typeof nextState !== 'object' || nextState === null)) ? (nextState as T) : Object.assign({}, this.state, nextState);
      for (const listener of this.listeners) {
        listener(this.state, previousState);
      }
    }
  }

  subscribe = (listener: (state: T, prevState: T) => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };
  getSnapshot = (): T => {
    return this.state;
  };
}
