import { useRef, useEffect } from 'react';

export function useClickOutside(
  callback: () => void,
): [ref: React.RefObject<HTMLDivElement>] {
  const ref = useRef<HTMLDivElement>(null);

  function handleEvent(event: Event) {
    if (!ref || !ref.current) {
      return
    }
    const node = event.target! as Node;
    if (ref.current === node || ref.current.contains(node)) {
      return
    }
    callback();
  }

  useEffect(() => {
    document.addEventListener('pointerdown', handleEvent);
    return () => {
      document.removeEventListener('pointerdown', handleEvent);
    };
  }, []);

  return [ref];
}
