function addVar(name: string, scope: Record<string, any>): void {
  scope.add(name, {
    type: null,
    value: undefined,
  });
}

function assignVal(name: string, val: any, scope: Record<string, any>): any {
  scope.set(name, val);
  return val;
}

function findVar(name: string, scope: Record<string, any>): any {
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

export { addVar, assignVal, findVar, readVal, assignArr };
