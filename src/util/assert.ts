export function assert(condition: boolean, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message || '断言错误');
  }
}