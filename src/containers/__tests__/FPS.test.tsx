import { FPS } from '../MenuBar/FPS';
import { cleanup, render, screen, act } from '@testing-library/react';
import React from 'react';

describe('FPS.test.tsx', () => {
  afterEach(cleanup);
  test('normal', () => {
    act(() => {
      render(<FPS />);
    });
    expect(screen.getByTestId('menubar-fps').textContent).toEqual('FPS: 0');
  });
});
