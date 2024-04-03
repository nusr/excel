import { Toast } from '../Toast';
import React from 'react';
import { cleanup, render } from '@testing-library/react';

describe('BaseIcon.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    const dom = render(<Toast type="success" message="test" />);
    expect(dom.container.childNodes.length).toEqual(1);
  });
});
