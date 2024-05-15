import { Controller } from '..';
import { Model } from '@/model';
import { getHitInfo, HTML_FORMAT, PLAIN_FORMAT } from '@/util';

describe('getHitInfo.test.ts', () => {
  test('basic', () => {
    const controller = new Controller(new Model(), {
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
    const range = getHitInfo(controller, 120, 48);
    expect(range!.row).toEqual(1);
    expect(range!.col).toEqual(1);
  });
  test('not found sheetId', () => {
    const controller = new Controller(new Model(), {
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
    const range = getHitInfo(controller, 10, 10);
    expect(range).toBeUndefined();
  });
  test('x is negative', () => {
    const controller = new Controller(new Model(), {
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
    const range = getHitInfo(controller, -1, -1);
    expect(range).toBeUndefined();
  });
  test('over threshold', () => {
    const controller = new Controller(new Model(), {
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
    const range = getHitInfo(controller, 100 * 60, 100 * 60);
    expect(range).toBeUndefined();
  });
});
