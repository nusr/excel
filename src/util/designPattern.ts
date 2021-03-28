import { assert } from "./assert";
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function singletonPattern<
  ConstructorType,
  ConstructorParams extends Array<unknown>
>(Constructor: new (...params: ConstructorParams) => ConstructorType) {
  let instance: ConstructorType | null;
  function getParams(...rest: ConstructorParams): ConstructorType {
    if (!instance) {
      instance = new Constructor(...rest);
    }
    assert(!!instance, "singletonPattern");
    return instance;
  }
  getParams.destroy = () => {
    instance = null;
  };
  return getParams;
}
