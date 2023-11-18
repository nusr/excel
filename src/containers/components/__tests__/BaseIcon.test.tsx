import { Icon } from '../BaseIcon';
import React from 'react';
import { cleanup, render } from '@testing-library/react';

describe('BaseIcon.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    const dom = render(<Icon name="plus" className="test_icon" />);
    expect(dom.container.querySelector('[class="test_icon"]')).not.toBeNull();
  });
});
