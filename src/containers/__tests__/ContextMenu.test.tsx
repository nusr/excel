import { ContextMenuContainer } from '../ContextMenu';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { initController } from '@/controller';

describe('ContextMenuContainer.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    render(<ContextMenuContainer controller={initController()} />);
    expect(screen.getByTestId('context-menu')!.childNodes).toHaveLength(7);
  });
});
