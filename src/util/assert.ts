export function assert(condition: boolean, message = 'assert error', env = process.env.NODE_ENV): asserts condition {
  if (!condition) {
    if (env !== 'test') {
      window.alert(message);
    }
    throw new Error(message);
  }
}
