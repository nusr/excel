import { initController } from '../../controller';
import { IController } from '../../types';
import { compareScreenShot } from './util';
import { numberFormatOptionList } from '../../containers/ToolBar/constant';
import i18n from '../../i18n';

describe('number-format.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
    controller.addSheet();
  });
  afterEach(async () => {
    await compareScreenShot(controller);
  });

  for (const item of numberFormatOptionList) {
    const isFrac = item.label === i18n.t('fraction');
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
