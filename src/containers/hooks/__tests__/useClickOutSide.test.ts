import { useClickOutside } from '../useClickOutSide';
import { fireEvent, renderHook } from '@testing-library/react';

describe('useClickOutside', () => {
  it('should call callback when clicking outside the element', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));
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
    const callback = jest.fn();
    const { result } = renderHook(() => useClickOutside(callback));
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
    const callback = jest.fn();
    const { result, unmount } = renderHook(() => useClickOutside(callback));
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
