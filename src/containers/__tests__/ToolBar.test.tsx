import { ToolbarContainer } from '../ToolBar';
import { cleanup, render, screen, act } from '@testing-library/react';
import React from 'react';
import { initController } from '@/controller';

describe('ToolbarContainer.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    act(() => {
      render(<ToolbarContainer controller={initController()} />);
    });
    expect(
      screen.getByTestId('toolbar')!.childNodes.length,
    ).toBeGreaterThanOrEqual(3);
  });
});
