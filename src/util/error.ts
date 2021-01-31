const cache = new Set<string>();
function outputError() {
  fetch("/buildError.txt")
    .then((res) => {
      if (res.status === 404) {
        return "";
      }
      return res.text();
    })
    .then((data) => {
      if (cache.has(data)) {
        return;
      }
      if (data) {
        cache.add(data);
        console.error(data);
      }
    })
    .catch(console.error);
}
export function handleBuildError(controller: unknown): () => void {
  if (process.env.NODE_ENV !== "development") {
    return () => {
      console.log("off");
    };
  }
  (window as any).controller = controller;
  outputError();
  return () => {
    console.log("off");
  };
  // const timer: ReturnType<typeof setInterval> = setInterval(outputError, 2000);
  // return () => clearInterval(timer);
}
