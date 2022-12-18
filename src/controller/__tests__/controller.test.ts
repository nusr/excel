import { Model } from '@/model';
import { Controller, History } from '..';

describe('controller.test.ts', () => {
  test('normal', () => {
    const controller = new Controller(new Model(), new History());
    expect(controller.canRedo()).toEqual(false);
    expect(controller.canUndo()).toEqual(false);
  });
});
