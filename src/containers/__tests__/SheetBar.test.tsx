import { SheetBarContainer } from '../SheetBar';
import { CanvasContainer } from '../canvas';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { initController } from '@/controller';

describe('SheetBarContainer.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    render(<SheetBarContainer controller={initController()} />);
    expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(0);
  });

  test('context menu', () => {
    const controller = initController();
    const Test = () => (
      <div>
        <CanvasContainer controller={controller} />
        <SheetBarContainer controller={controller} />
      </div>
    );
    render(<Test />);
    fireEvent.contextMenu(screen.getByTestId('sheet-bar-list')!.childNodes[0], {
      clientX: 199,
    });
    expect(screen.getByTestId('sheet-bar-context-menu').childNodes).toHaveLength(5);
  });
});
