import { renderHook, act } from '@testing-library/react';
import { useFPS } from '../useFPS';

describe('useFPS', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(performance, 'now').mockImplementation(() => Date.now());
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback): number => {
      setTimeout(callback, 16);
      return 0
    });
  })

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('should initialize fps to 0', () => {
    const { result } = renderHook(() => useFPS());
    expect(result.current).toBe(0);
  });

  it('should update fps after 1 second', async () => {
    const { result } = renderHook(() => useFPS());
    await act(async () => {
      return await jest.advanceTimersByTime(2000);
    })
    expect(result.current).toBeGreaterThan(0);
  });

  it('should clean up on unmount', () => {
    const cancelAnimationFrameSpy = jest.spyOn(window, 'cancelAnimationFrame');
    const { unmount } = renderHook(() => useFPS());

    act(() => {
      unmount();
    })

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
  });


});
