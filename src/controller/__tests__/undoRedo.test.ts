import { Controller } from '..';
import { Model } from '@/model';
import { mockHooks } from '../init'

describe('undoRedo.test.ts', () => {
  let controller: Controller;
  beforeEach(() => {
    controller = new Controller(new Model(), mockHooks);
    controller.addSheet();
  });

  describe('undo redo', () => {
    test('normal', () => {
      const c = new Controller(new Model(), mockHooks);
      expect(c.canRedo()).toEqual(false);
      expect(c.canUndo()).toEqual(false);
    });
  });
});
