class BuildInMethod {
  buildInMethodMap = new Map<string, (...data: any[]) => any>();
  register(methodName: string, method: (...data: any[]) => any) {
    this.buildInMethodMap.set(methodName, method);
  }
  get(methodName: string) {
    return this.buildInMethodMap.get(methodName);
  }
  has(methodName: string) {
    return this.buildInMethodMap.has(methodName);
  }
}

export const buildInMethodHandler = new BuildInMethod();
