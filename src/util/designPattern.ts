import { assert } from "./assert";
export function singletonPattern<T, D extends Array<unknown>>(
  C: new (...params: D) => T
): (...params: D) => T {
  let instance: T | null;
  function getParams(...rest: D): T {
    if (!instance) {
      instance = new C(...rest);
    }
    assert(!!instance);
    return instance;
  }
  getParams.destroy = () => {
    instance = null;
  };
  return getParams;
}
