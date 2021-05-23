import { errPrint } from "../init/commons";

let scopeId = 0;

class Scope {
  scope: Record<string, any>;
  parent: any;
  scopeId: number;
  type: unknown;
  returnValue: unknown;
  constructor(parent: any = null, type = "block") {
    this.scope = {};
    this.parent = parent;
    this.scopeId = scopeId++;
    this.type = type;
    this.returnValue = null;
  }

  add(name: string | null): void {
    if (name === null) {
      return;
    }
    this.scope[name] = {
      _inner: true,
      name,
      value: undefined,
    };
  }
  set(name: string | null, value: unknown, type: unknown): void {
    if (name === null) {
      return;
    }
    if (!this.scope[name]) {
      this.scope[name] = { _inner: true, name };
    }
    this.scope[name].value = value;
    this.scope[name].type = type;
  }

  static warpVal(value: any) {
    if (typeof value === "undefined") {
      return "undefined";
    }
    if (value === null) {
      return null;
    }
    if (value._inner === true) {
      return value;
    }
    return {
      value,
      _inner: true,
    };
  }

  get(name: string): any {
    let scope = this.scope;
    let parent = this.parent;
    while (scope !== null) {
      if (scope[name]) {
        return scope[name];
      }
      scope = parent;
      if (parent) {
        parent = parent.parent;
      }
    }
    return undefined;
  }

  getProperty(
    name: string,
    key: any
  ): {
    _inner: boolean;
    _parent: unknown;
    _key: unknown;
    name: string;
    value: unknown;
  } {
    const val = this.get(name);
    if (val === null) {
      errPrint(`Uncaught ReferenceError: ${name} is not defined`);
    }
    return {
      _inner: true,
      _parent: val,
      _key: key,
      name,
      value: val.value[key],
    };
  }
}

export { Scope };
