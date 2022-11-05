import { SheetBarContainer } from '..';
import { h, render } from '@/react';
import globalStore from '@/store';

describe('SheetBarContainer.test.ts', () => {
  test('normal', () => {
    globalStore.set({
      sheetList: [],
    });
    render(h(SheetBarContainer, {}), document.body);
    expect(
      document.querySelector('.sheet-bar-wrapper')!.childNodes,
    ).toHaveLength(2);
    expect(document.querySelector('.sheet-bar-list')!.childNodes).toHaveLength(
      0,
    );
  });
  test('add sheet', () => {
    globalStore.set({
      sheetList: [
        {
          sheetId: 'test',
          name: 'test',
          rowCount: 20,
          colCount: 20,
        },
      ],
    });
    render(h(SheetBarContainer, {}), document.body);

    expect(document.querySelector('.sheet-bar-list')!.childNodes).toHaveLength(
      1,
    );
  });
});
