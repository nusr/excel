import { Icon } from '../BaseIcon';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('BaseIcon.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    render(<Icon name="plus" testId="icon_data" className="test_icon" />);
    expect(screen.getByTestId('icon_data')).toBeInTheDocument();
  });
});
