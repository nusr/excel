import { App } from '@/containers';
import * as React from 'react';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { type } from './util';
import { initControllerForTest } from '@/controller';
import './global.mock';
import * as Util from '../util/saveAs';

beforeAll(() => {
  Object.defineProperty(Util, 'saveAs', { writable: true, value: jest.fn() });
});

describe('Export.test.ts', () => {
  describe('download chart', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      type('1');
      fireEvent.click(screen.getByTestId('toolbar-chart'));
      expect(screen.getAllByTestId('float-element')).toHaveLength(1);
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });

      fireEvent.click(
        screen.getByTestId('float-element-context-menu-save-as-picture'),
      );
      expect(Util.saveAs).toHaveBeenCalled();
    });
  });
  describe('download floating picture', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      const file = new File(['test content'], 'test.png', {
        type: 'image/png',
      });
      fireEvent.change(screen.getByTestId('toolbar-floating-picture-input'), {
        target: { files: [file] },
      });

      await waitFor(() => {
        expect(screen.getAllByTestId('float-element')).toHaveLength(1);
      });
      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });

      fireEvent.click(
        screen.getByTestId('float-element-context-menu-save-as-picture'),
      );
      expect(Util.saveAs).toHaveBeenCalled();
    });
  });
  describe('download xlsx', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      type('test');
      fireEvent.click(screen.getByTestId('menubar-excel'));
      fireEvent.click(screen.getByTestId('menubar-export'));
      fireEvent.click(screen.getByTestId('menubar-export-xlsx'));
      expect(Util.saveAs).toHaveBeenCalled();
    });
  });
  describe('download csv', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      type('test');
      fireEvent.click(screen.getByTestId('menubar-excel'));
      fireEvent.click(screen.getByTestId('menubar-export'));
      fireEvent.click(screen.getByTestId('menubar-export-csv'));
      expect(Util.saveAs).toHaveBeenCalled();
    });
  });
});
