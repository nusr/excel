import { ContextMenuContainer } from '..';
import { render } from '@/react';
import { DEFAULT_STORE_VALUE } from '@/util';
import { initController } from '../../init';
import { StoreValue } from '@/types';

describe('ContextMenuContainer.test.ts', () => {
  test('normal', () => {
    const state: StoreValue = {
      ...DEFAULT_STORE_VALUE,
      contextMenuPosition: {
        top: 10,
        left: 10,
        width: 100,
        height: 100,
      },
    };
    render(document.body, ContextMenuContainer(state, initController()));
    expect(
      document.body.querySelector('.context-menu')!.childNodes,
    ).toHaveLength(4);
  });
});
