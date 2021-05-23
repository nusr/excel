const buildInMethods: Record<string, any> = {};

function addBuildInMethod(name: string, fn: any): void {
  buildInMethods[name] = fn;
}

export { addBuildInMethod, buildInMethods };
