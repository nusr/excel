export class BaseStore<T> {
  private listeners: Set<(state: T, prevState: T) => void> = new Set()
  private state: T;
  constructor(initValue: T) {
    this.state = initValue;
  }
  setState = (partial: T | Partial<T> | ((state: T) => (T | Partial<T>)), replace?: boolean) => {
    if (Array.isArray(partial)) {
      replace = true
    }
    const nextState = typeof partial === 'function' ? (partial as (state: T) => T)(this.state) : partial;
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
