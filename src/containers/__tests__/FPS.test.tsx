import { FPS } from '../MenuBar/FPS';
import { cleanup, render, screen, act } from '@testing-library/react';
import React from 'react';
import { sleep } from '@/util';
import '@testing-library/jest-dom';

describe('FPS.test.tsx', () => {
  afterEach(cleanup);
  test('normal', async () => {
    act(() => {
      render(<FPS />);
    });
    const text = parseInt(
      screen.getByTestId('menubar-fps-num').textContent || '',
      10,
    );
    expect(text).toEqual(0);
  });
  test.skip('sleep', async () => {
    act(async () => {
      render(<FPS />);
    });
    await sleep(1000);
    const text = parseInt(
      screen.getByTestId('menubar-fps-num').textContent || '',
      10,
    );
    expect(text).toBeGreaterThan(20);
  });
});
