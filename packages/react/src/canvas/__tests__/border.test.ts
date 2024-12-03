import { initController, getMockHooks } from '../../controller';
import { BorderItem, IController } from '@excel/shared';
import { compareScreenShot } from './util';
import { BORDER_TYPE_MAP } from '@excel/shared';

describe('border.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController(getMockHooks());
    controller.addSheet();
  });
  afterEach(async () => {
    await compareScreenShot(controller);
  });
  describe('border type', () => {
    const keyList = Object.keys(BORDER_TYPE_MAP) as Array<BorderItem['type']>;
    for (const key of keyList) {
      test(key, () => {
        const item: BorderItem = {
          type: key,
          color: '',
        };
        controller.setCell(
          [[1]],
          [
            [
              {
                borderLeft: item,
                borderRight: item,
                borderTop: item,
                borderBottom: item,
              },
            ],
          ],
          {
            row: 1,
            col: 1,
            rowCount: 1,
            colCount: 1,
            sheetId: '',
          },
        );
      });
    }
  });
});