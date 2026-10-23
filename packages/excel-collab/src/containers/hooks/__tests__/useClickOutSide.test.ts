import { vi } from 'vitest';
import { useClickOutside } from '../useClickOutSide';
import { fireEvent, renderHook } from '@testing-library/react';

describe('useClickOutside', () => {
  it('uses the latest handler after rerendering an open popup', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ handler }) => useClickOutside(true, handler), {
      initialProps: { handler: first },
    });
    rerender({ handler: second });
    fireEvent.pointerDown(document);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });

  it('should call callback when clicking outside the element', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useClickOutside(true, callback));
    const ref = result.current;

    const div = document.createElement('div');
    // @ts-ignore
    ref.current = div;
    document.body.appendChild(div);

    fireEvent.pointerDown(document);

    expect(callback).toHaveBeenCalledTimes(1);

    document.body.removeChild(div);
  });

  it('should not call callback when clicking inside the element', () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useClickOutside(true, callback));
    const ref = result.current;

    const div = document.createElement('div');
    // @ts-ignore
    ref.current = div;
    document.body.appendChild(div);

    fireEvent.pointerDown(div);

    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(div);
  });

  it('should clean up event listeners on unmount', () => {
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useClickOutside(true, callback));
    const ref = result.current;

    const div = document.createElement('div');
    // @ts-ignore
    ref.current = div;
    document.body.appendChild(div);

    unmount();

    fireEvent.pointerDown(document);

    expect(callback).not.toHaveBeenCalled();

    // Clean up
    document.body.removeChild(div);
  });
});
