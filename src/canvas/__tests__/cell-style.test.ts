import { initController } from '@/controller';
import {
  EUnderLine,
  IController,
  EVerticalAlign,
  EHorizontalAlign,
} from '@/types';
import { snapshot } from './util';

describe('cell-style.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
  });
  afterEach(async () => {
    await snapshot(controller);
  });

  describe('basic', () => {
    test('ok', () => {
      controller.setCell(
        [[1]],
        [
          [
            {
              fontColor: 'red',
              isBold: true,
              isItalic: true,
              fontSize: 20,
              isStrike: true,
              underline: EUnderLine.SINGLE,
            },
          ],
        ],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        },
      );
    });
    test('fill color', () => {
      controller.setCell(
        [[1]],
        [
          [
            {
              fillColor: 'red',
            },
          ],
        ],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        },
      );
    });
    test.skip('wrap text', () => {
      controller.setCell(
        [['This is a very long text that needs to be wrapped']],
        [
          [
            {
              isWrapText: true,
            },
          ],
        ],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        },
      );
    });
  });
  describe('align', () => {
    for (const v of [
      EVerticalAlign.TOP,
      EVerticalAlign.MIDDLE,
      EVerticalAlign.BOTTOM,
    ]) {
      for (const h of [
        EHorizontalAlign.LEFT,
        EHorizontalAlign.CENTER,
        EHorizontalAlign.RIGHT,
      ]) {
        test(`${EVerticalAlign[v]} ${EHorizontalAlign[h]}`, () => {
          controller.setRowHeight(0, controller.getRowHeight(0).len * 2);
          controller.setColWidth(0, controller.getColWidth(0).len * 2);
          controller.setCell(
            [[1]],
            [
              [
                {
                  horizontalAlign: h,
                  verticalAlign: v,
                },
              ],
            ],
            {
              row: 0,
              col: 0,
              rowCount: 1,
              colCount: 1,
              sheetId: '',
            },
          );
        });
      }
    }
  });
});
