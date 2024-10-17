import { Toast, toast } from '../Toast';
import React from 'react';
import { cleanup, render, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('BaseIcon.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    const dom = render(<Toast type="success" message="test" testId="test" />);
    expect(dom.container.childNodes.length).toEqual(1);
  });
  test('close', () => {
    let close: () => void;
    act(() => {
      close = toast({
        type: 'success',
        message: 'test',
        testId: 'toast-close',
        duration: 1,
      });
    });
    expect(screen.getByTestId('toast-close').textContent).toEqual('test');
    act(() => {
      close();
    });
    expect(() => screen.getByTestId('toast-close')).toThrow();
  });
  test('close twice', () => {
    let close: () => void;
    act(() => {
      close = toast({
        type: 'success',
        message: 'test',
        testId: 'toast-twice',
        duration: 1,
      });
    });
    expect(screen.getByTestId('toast-twice').textContent).toEqual('test');
    act(() => {
      close();
    });
    expect(() => screen.getByTestId('toast-twice')).toThrow();
    act(() => {
      close();
    });
    expect(() => screen.getByTestId('toast-twice')).toThrow();
  });
  for (const key of ['error', 'info', 'warning', 'success'] as const) {
    const testId = `${key}-toast`;
    test(testId, () => {
      let close: () => void;
      act(() => {
        close = toast[key]('message');
      });
      expect(screen.getByTestId(testId).textContent).toEqual('message');
      act(() => {
        close();
      });
      expect(() => screen.getByTestId(testId)).toThrow();
    });
  }
  for (const key of ['error', 'info', 'warning', 'success'] as const) {
    test(key, () => {
      let close: () => void;
      act(() => {
        close = toast[key]('message', key);
      });
      expect(screen.getByTestId(key).textContent).toEqual('message');
      act(() => {
        close();
      });
      expect(() => screen.getByTestId(key)).toThrow();
    });
  }
});
