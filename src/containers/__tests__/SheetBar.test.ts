import { SheetBarContainer } from '..';
import { render } from '@/react';
import globalStore from '@/store';
import { JSDOM } from 'jsdom';
global.document = new JSDOM(`<div id="app"></div>`).window.document;

describe('SheetBarContainer.test.ts', () => {
  test('normal', () => {
    globalStore.set({
      sheetList: [],
    });
    render(document.getElementById('app')!, SheetBarContainer({}));
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
    render(document.getElementById('app')!, SheetBarContainer({}));

    expect(document.querySelector('.sheet-bar-list')!.childNodes).toHaveLength(
      1,
    );
  });
});
