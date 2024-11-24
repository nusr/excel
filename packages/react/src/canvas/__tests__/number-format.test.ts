import { initController, getMockHooks } from '../../controller';
import { IController } from '@excel/shared';
import { compareScreenShot } from './util';
import { numberFormatOptionList } from '../../containers/ToolBar/constant';
import { $ } from '../../i18n';

describe('number-format.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController(getMockHooks());
    controller.addSheet();
  });
  afterEach(async () => {
    await compareScreenShot(controller, { maxThreshold: 0.054 });
  });

  for (const item of numberFormatOptionList) {
    const isFrac = item.label === $('fraction');
    test(item.label, () => {
      const value = isFrac ? 0.3333 : 1;
      controller.setCell([[value]], [[{ numberFormat: item.value }]], {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
    });
  }
});
