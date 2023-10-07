import { SheetBarContainer } from '../SheetBar';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { initController } from '@/controller';

describe('SheetBarContainer.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    render(<SheetBarContainer controller={initController()} />);
    expect(screen.getByTestId('sheet-bar-list')!.childNodes).toHaveLength(0);
  });
});
