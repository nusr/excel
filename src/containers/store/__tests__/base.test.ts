import { BaseStore } from '../base';

describe('BaseStore', () => {
  it('should initialize with the given state', () => {
    const initialState = { count: 0 };
    const store = new BaseStore(initialState);
    expect(store.getSnapshot()).toEqual(initialState);
  });

  it('should update state correctly with setState', () => {
    const initialState = { count: 0 };
    const store = new BaseStore(initialState);
    store.setState({ count: 1 });
    expect(store.getSnapshot()).toEqual({ count: 1 });
  });

  it('should replace state if replace flag is true', () => {
    const initialState = { count: 0, name: 'test' };
    const store = new BaseStore(initialState);
    store.setState({ count: 1 }, true);
    expect(store.getSnapshot()).toEqual({ count: 1 });
  });

  it('should notify listeners on state change', () => {
    const initialState = { count: 0 };
    const store = new BaseStore(initialState);
    const listener = jest.fn();
    store.subscribe(listener);
    store.setState({ count: 1 });
    expect(listener).toHaveBeenCalledWith({ count: 1 }, { count: 0 });
  });

  it('should not notify listeners if state does not change', () => {
    const initialState = { count: 0 };
    const store = new BaseStore(initialState);
    const listener = jest.fn();
    store.subscribe(listener);
    store.setState({ count: 0 });
    expect(listener).not.toHaveBeenCalled();
  });

  it('should allow unsubscribing listeners', () => {
    const initialState = { count: 0 };
    const store = new BaseStore(initialState);
    const listener = jest.fn();
    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.setState({ count: 1 });
    expect(listener).not.toHaveBeenCalled();
  });
});
