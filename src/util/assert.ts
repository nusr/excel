export function assert(
  condition: boolean,
  message?: string
): asserts condition {
  if (!condition) {
    const realMessage = message || "断言错误";
    if (process.env.NODE_ENV === "production") {
      console.error(realMessage);
      return;
    }
    throw new Error(realMessage);
  }
}
