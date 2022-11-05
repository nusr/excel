import { ToolbarContainer } from '..';
import { h, render } from '@/react';
import globalStore from '@/store';

describe('ToolbarContainer.test.ts', () => {
  test('normal', () => {
    globalStore.set({
      activeCell: {
        row: 0,
        col: 0,
      },
    });
    render(h(ToolbarContainer, {}), document.body);
    expect(document.querySelector('.toolbar-wrapper')!.childNodes).toHaveLength(
      10,
    );
  });
});
