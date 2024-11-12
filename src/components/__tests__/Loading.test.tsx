import { Loading } from '../Loading';
import { cleanup, render } from '@testing-library/react';

describe('BaseIcon.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    const dom = render(<Loading />);
    expect(dom.container.childNodes.length).toEqual(1);
  });
});
