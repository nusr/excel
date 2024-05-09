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
    let close: any;
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
    let close: any;
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
});
