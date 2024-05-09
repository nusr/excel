import { App } from '@/containers';
import * as React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { type } from './util';
import { initController } from '@/controller';
import './global.mock';

describe('VerticalAlign.test.tsx', () => {
  describe('top', () => {
    test('ok', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-vertical-top'));
      expect(screen.getByTestId('toolbar-vertical-top')).toHaveClass('active');
    });
  });
  describe('middle', () => {
    test('ok', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-vertical-middle'));
      expect(screen.getByTestId('toolbar-vertical-middle')).toHaveClass(
        'active',
      );
    });
  });
  describe('bottom', () => {
    test('ok', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-vertical-bottom'));
      expect(screen.getByTestId('toolbar-vertical-bottom')).toHaveClass(
        'active',
      );
    });
  });
});
