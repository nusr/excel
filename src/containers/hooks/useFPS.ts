import { useState, useEffect } from 'react'
export function useFPS() {
  const [fps, setFps] = useState(0);
  useEffect(() => {
    let fpsCounter = 0;
    let lastCalledTime = performance.now();
    let timer: number;
    function updateFPS() {
      fpsCounter++;
      let delta = (performance.now() - lastCalledTime) / 1000;
      if (delta > 1) {
        let fps = fpsCounter / delta;
        setFps(Math.round(fps));
        fpsCounter = 0;
        lastCalledTime = performance.now();
      }
      timer = requestAnimationFrame(updateFPS);
    }
    timer = requestAnimationFrame(updateFPS);
    return () => {
      cancelAnimationFrame(timer);
    };
  }, []);
  return fps
}
