import { Scope } from "./scope";
function assignVal(name: string, val: any, scope: Scope): any {
  scope.set(name, val);
  return val;
}

function findVar(name: string, scope: Scope): any {
  return scope.get(name);
}

function readVal(object: any): any {
  if (object && object._inner) {
    return object.value;
  }
  return object;
}

function assignArr(object: any, val: any): any {
  const key = object._key;
  object._parent.value[key] = val;
  return val;
}

export { assignVal, findVar, readVal, assignArr };
