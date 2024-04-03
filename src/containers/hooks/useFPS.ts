import { useEffect, useState, useRef } from 'react';

export function useFPS() {
  const [fps, setFps] = useState(0);
  const ref = useRef(0);

  useEffect(() => {
    let fpsCounter = 0;
    let lastCalledTime = performance.now();
    function updateFPS() {
      fpsCounter++;
      let delta = (performance.now() - lastCalledTime) / 1000;
      if (delta > 1) {
        let fps = fpsCounter / delta;
        setFps(Math.round(fps));
        fpsCounter = 0;
        lastCalledTime = performance.now();
      }
      ref.current = requestAnimationFrame(updateFPS);
    }
    ref.current = requestAnimationFrame(updateFPS);
    return () => {
      cancelAnimationFrame(ref.current);
    };
  }, []);

  return [fps];
}
