import { Model } from '@/model';
import { Controller, Scroll, History } from '..';

describe('controller.test.ts', () => {
  test('normal', () => {
    const controller = new Controller(new Model(), new Scroll(), new History());
    expect(controller.canRedo()).toEqual(false);
    expect(controller.canUndo()).toEqual(false);
  });
});
