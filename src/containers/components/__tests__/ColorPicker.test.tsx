import ColorPicker from '../ColorPicker';
import { cleanup, render } from '@testing-library/react';
import React from 'react';

describe('ColorPicker.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    const dom = render(<ColorPicker color="#fff" onChange={() => {}} />);
    expect(dom).not.toBeNull();
  });
});
