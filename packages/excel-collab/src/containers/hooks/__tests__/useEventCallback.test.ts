import { useEventCallback } from '../useEventCallback';
import { act, renderHook } from '@testing-library/react';

describe('useEventCallback', () => {
  it('should call the handler with the correct value', () => {
    const handler = jest.fn();
    const { result } = renderHook(() => useEventCallback(handler));

    act(() => {
      result.current('test value');
    });

    expect(handler).toHaveBeenCalledWith('test value');
  });

  it('should update the handler when it changes', () => {
    const initialHandler = jest.fn();
    const updatedHandler = jest.fn();
    const { result, rerender } = renderHook(
      ({ handler }) => useEventCallback(handler),
      { initialProps: { handler: initialHandler } }
    );

    act(() => {
      result.current('initial value');
    });

    expect(initialHandler).toHaveBeenCalledWith('initial value');
    expect(updatedHandler).not.toHaveBeenCalled();

    rerender({ handler: updatedHandler });

    act(() => {
      result.current('updated value');
    });

    expect(updatedHandler).toHaveBeenCalledWith('updated value');
  });

});
