import { useRef, useEffect } from 'react';

export function useClickOutside(
  handler: () => void,
  shouldExecute: boolean = true,
) {
  const ref = useRef<HTMLDivElement>(null);

  function handleEvent(event: Event) {
    const node = event.target as any;
    if (
      ref?.current &&
      (ref.current === node ||
        (node instanceof Node && ref.current.contains(node)))
    ) {
      return;
    }
    handler();
  }

  useEffect(() => {
    if (!shouldExecute) {
      return;
    }
    document.addEventListener('pointerdown', handleEvent);
    window.addEventListener('blur', handleEvent);
    return () => {
      document.removeEventListener('pointerdown', handleEvent);
      window.removeEventListener('blur', handleEvent);
    };
  }, [shouldExecute]);

  return ref;
}
