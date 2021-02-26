import { assert } from "./assert";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function singletonPattern<T, D extends Array<unknown>>(
  C: new (...params: D) => T
) {
  let instance: T | null;
  function getParams(...rest: D): T {
    if (!instance) {
      instance = new C(...rest);
    }
    assert(!!instance, "singletonPattern");
    return instance;
  }
  getParams.destroy = () => {
    instance = null;
  };
  return getParams;
}
