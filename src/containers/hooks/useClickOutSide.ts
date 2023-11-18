import { useState, useRef, useEffect } from 'react';

export function useClickOutside(callback: () => void): [ref: React.RefObject<HTMLDivElement>, clickedOutSide: boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [clickedOutSide, setState] = useState(false);

  function handleEvent(event: Event) {
    if (ref && ref.current) {
      if (ref.current.contains(event.target! as Node)) {
        setState(false);
      } else {
        setState(true);
        callback();
      }
    }
  }

  useEffect(() => {
    if (window.PointerEvent) {
      document.addEventListener('pointerdown', handleEvent);
    } else {
      document.addEventListener('mousedown', handleEvent);
      document.addEventListener('touchstart', handleEvent);
    }

    return () => {
      if (window.PointerEvent) {
        document.removeEventListener('pointerdown', handleEvent);
      } else {
        document.removeEventListener('mousedown', handleEvent);
        document.removeEventListener('touchstart', handleEvent);
      }
    };
  }, []);

  return [ref, clickedOutSide];
}
