import { Toast, toast } from '../Toast';
import React from 'react';
import { cleanup, render, act, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('BaseIcon.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    const dom = render(<Toast type="success" message="test" />);
    expect(dom.container.childNodes.length).toEqual(1);
  });
  test('toast', () => {
    let close: any;
    act(() => {
      close = toast({
        type: 'success',
        message: 'test',
        testId: 'toast',
        duration: 1,
      });
    });
    expect(screen.getByTestId('toast').textContent).toEqual('test');
    act(() => {
      close();
    });
    expect(() => screen.getByTestId('toast')).toThrow();
  });
});
