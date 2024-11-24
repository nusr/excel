import { initController, getMockHooks } from '../../controller';
import {
  EUnderLine,
  IController,
  EVerticalAlign,
  EHorizontalAlign,
} from '@excel/shared';
import { compareScreenShot } from './util';

describe('cell-style.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController(getMockHooks());
    controller.addSheet();
  });
  afterEach(async () => {
    await compareScreenShot(controller);
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
    test('double underline', () => {
      controller.setCell(
        [[1]],
        [
          [
            {
              underline: EUnderLine.DOUBLE,
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
          controller.setRowHeight(0, controller.getRow(0).len * 2);
          controller.setColWidth(0, controller.getCol(0).len * 2);
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
