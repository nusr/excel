import { useEffect, useRef, useState } from 'react';

export function useFPS() {
  const animRef = useRef(0);
  const [fps, setFps] = useState(0);

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
      animRef.current = requestAnimationFrame(updateFPS);
    }

    animRef.current = requestAnimationFrame(updateFPS);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return [fps];
}
