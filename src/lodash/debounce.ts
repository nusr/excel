export function debounce(fn: (...params: any[]) => void) {
  let timer: ReturnType<typeof requestAnimationFrame>;
  return (...rest: any[]) => {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(() => {
      fn(...rest);
    });
  };
}