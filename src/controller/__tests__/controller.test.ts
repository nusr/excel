import { Controller } from '..';
import { Model } from '@/model';
import { HTML_FORMAT, PLAIN_FORMAT, headerSizeSet } from '@/util';

describe('controller.test.ts', () => {
  let controller: Controller;
  beforeEach(() => {
    controller = new Controller(new Model(), {
      async copyOrCut() {
        return '';
      },
      async paste() {
        return {
          [HTML_FORMAT]: '',
          [PLAIN_FORMAT]: '',
        };
      },
    });
    controller.addSheet();
  });

  describe('scroll', () => {
    test('get', () => {
      expect(controller.getScroll()).toEqual({
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        scrollLeft: 0,
        scrollTop: 0,
      });
    });
    test('set', () => {
      const headerSize = headerSizeSet.get();
      controller.setScroll({
        top: 1000,
        left: 0,
        row: 100000,
        col: 0,
        scrollLeft: 0,
        scrollTop: 80800,
      });
      expect(controller.getScroll()).toEqual({
        top: 1000,
        left: 0,
        row: 100000,
        col: 0,
        scrollLeft: 0,
        scrollTop: 80800,
      });
      expect(headerSizeSet.get()).toEqual({
        width: headerSize.width * 2,
        height: headerSize.height,
      });
    });
  });

  describe('copy', () => {
    test('set', () => {
      let text = '';
      const textFormat = 'text/plain';
      const event = {
        clipboardData: {
          setData(type: string, data: string) {
            if (type === textFormat) {
              text = data;
            }
          },
        },
      };
      controller.copy(event as ClipboardEvent);
      expect(!!text).toEqual(true);
    });
  });

  describe('computeCellPosition', () => {
    test('normal', () => {
      const headerSize = headerSizeSet.get();
      const size = controller.computeCellPosition({
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: '',
      });
      expect(size).toEqual({
        left: headerSize.width,
        top: headerSize.height,
      });
    });
  });

  describe('DomRect', () => {
    test('get', () => {
      const size = controller.getDomRect();
      expect(size).toEqual({ left: 0, top: 0, width: 0, height: 0 });
    });
  });
});
