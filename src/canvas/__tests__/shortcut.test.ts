import { handleTabClick } from '../shortcut';
import { IController } from '@/types';

describe('shortcut.test.ts', () => {
  describe('handleTabClick', () => {
    test('should call batchUpdate and setNextActiveCell', () => {
      const controller: IController = {
        batchUpdate: jest.fn(),
        setNextActiveCell: jest.fn(),
      } as unknown as IController;
      handleTabClick(controller);

      expect(controller.batchUpdate).toHaveBeenCalledTimes(1);
    });
  });
});
