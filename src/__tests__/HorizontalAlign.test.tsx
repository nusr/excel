import {App} from '@/containers';
import * as React from 'react';
import {render, screen, act, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom';
import {type} from './util';
import {initController} from '@/controller';
import './global.mock';

describe('HorizontalAlign.test.tsx', () => {
  describe('left', () => {
    test('ok', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-horizontal-left'));
      expect(screen.getByTestId('toolbar-horizontal-left')).toHaveClass('active');
    });
  });
  describe('center', () => {
    test('ok', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-horizontal-center'));
      expect(screen.getByTestId('toolbar-horizontal-center')).toHaveClass('active');
    });
  });
  describe('right', () => {
    test('ok', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('test');
      fireEvent.click(screen.getByTestId('toolbar-horizontal-right'));
      expect(screen.getByTestId('toolbar-horizontal-right')).toHaveClass('active');
    });
  });
});
