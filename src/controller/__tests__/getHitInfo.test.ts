import { Controller } from '..';
import { Model } from '@/model';
import { getHitInfo } from '@/util';

describe('getHitInfo.test.ts', () => {
  test('basic', () => {
    const controller = new Controller(new Model());
    controller.addSheet();
    const range = getHitInfo(controller, 102, 38);
    expect(range!.row).toEqual(1);
    expect(range!.col).toEqual(1);
  });
});
