import { useState, useRef, useEffect } from 'react';

export function useClickOutside(
  callback: () => void,
): [ref: React.RefObject<HTMLDivElement>, clickedOutSide: boolean] {
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
    document.addEventListener('pointerdown', handleEvent);

    return () => {
      document.removeEventListener('pointerdown', handleEvent);
    };
  }, []);

  return [ref, clickedOutSide];
}
