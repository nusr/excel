import { CanvasContainer } from '../canvas';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { initController } from '@/controller';

describe('CanvasContainer.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    render(<CanvasContainer controller={initController()} />);
    expect(screen.getByTestId('canvas-container')!.childNodes).toHaveLength(3);
    expect(
      screen.getByTestId('canvas-container')!.firstChild!.nodeName,
    ).toEqual('CANVAS');
  });
});
