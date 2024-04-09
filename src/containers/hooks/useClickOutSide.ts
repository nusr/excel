import { useRef, useEffect } from 'react';

export function useClickOutside(
  callback: () => void,
): [ref: React.RefObject<HTMLDivElement>] {
  const ref = useRef<HTMLDivElement>(null);

  function handleEvent(event: Event) {
    if (ref && ref.current) {
      if (ref.current.contains(event.target! as Node)) {
      } else {
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

  return [ref];
}
