import { handleTabClick } from '../shortcut';
import { IController } from '../../types';

describe('shortcut.test.ts', () => {
  describe('handleTabClick', () => {
    test('should call transaction and setNextActiveCell', () => {
      const controller: IController = {
        setNextActiveCell: jest.fn(),
        transaction: jest.fn(),
      } as unknown as IController;
      handleTabClick(controller);

      expect(controller.transaction).toHaveBeenCalledTimes(1);
    });
  });
});
