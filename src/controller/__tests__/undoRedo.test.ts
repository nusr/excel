import { Controller } from '..';
import { Model } from '@/model';
import { HTML_FORMAT, PLAIN_FORMAT } from '@/util';

describe('undoRedo.test.ts', () => {
  let controller: Controller;
  beforeEach(() => {
    controller = new Controller(new Model(), {
      async copyOrCut() {
        return '';
      },
      async paste() {
        return {
          [HTML_FORMAT]: '',
          [PLAIN_FORMAT]: '',
        };
      },
    });
    controller.addSheet();
  });

  describe('undo redo', () => {
    test('normal', () => {
      const c = new Controller(new Model(), {
        async copyOrCut() {
          return '';
        },
        async paste() {
          return {
            [HTML_FORMAT]: '',
            [PLAIN_FORMAT]: '',
          };
        },
      });
      expect(c.canRedo()).toEqual(false);
      expect(c.canUndo()).toEqual(false);
    });
  });
});
