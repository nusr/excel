import { useState, useRef, useEffect } from 'react';
export function useClickOutside(callback) {
    const ref = useRef(null);
    const [clickedOutSide, setState] = useState(false);
    function handleEvent(event) {
        if (ref && ref.current) {
            if (ref.current.contains(event.target)) {
                setState(false);
            }
            else {
                setState(true);
                callback();
            }
        }
    }
    useEffect(() => {
        if (window.PointerEvent) {
            document.addEventListener('pointerdown', handleEvent);
        }
        else {
            document.addEventListener('mousedown', handleEvent);
            document.addEventListener('touchstart', handleEvent);
        }
        return () => {
            if (window.PointerEvent) {
                document.removeEventListener('pointerdown', handleEvent);
            }
            else {
                document.removeEventListener('mousedown', handleEvent);
                document.removeEventListener('touchstart', handleEvent);
            }
        };
    }, []);
    return [ref, clickedOutSide];
}
//# sourceMappingURL=useClickOutSide.js.map