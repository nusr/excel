import { cleanup } from '@testing-library/react';
import { canvasSizeSet } from '@/util';
import '@testing-library/jest-dom';

afterEach(cleanup);
beforeAll(() => {
  const spy = jest.spyOn(canvasSizeSet, 'get');
  spy.mockReturnValue({ top: 144, left: 0, width: 1300, height: 500 });
});
