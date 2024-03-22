import { App } from '@/containers';
import { initController } from '@/controller';
import * as React from 'react';
import { cleanup, render, act, screen } from '@testing-library/react';

describe('App.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    const controller = initController();
    act(() => {
      render(<App controller={controller} />);
    });
    expect(
      screen.getByTestId('app-container')!.childNodes.length,
    ).toBeGreaterThanOrEqual(5);
  });
});
