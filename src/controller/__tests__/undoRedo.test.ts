import { Controller } from '..';
import { Model } from '@/model';
import { mockTestHooks } from '../init'

describe('undoRedo.test.ts', () => {
  let controller: Controller;
  beforeEach(() => {
    controller = new Controller(new Model(), mockTestHooks);
    controller.addSheet();
  });

  describe('undo redo', () => {
    test('normal', () => {
      const c = new Controller(new Model(), mockTestHooks);
      expect(c.canRedo()).toEqual(false);
      expect(c.canUndo()).toEqual(false);
    });
  });
});
