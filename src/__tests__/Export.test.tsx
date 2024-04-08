import { App } from '@/containers';
import * as React from 'react';
import {
  cleanup,
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { type } from './util';
import { initControllerForTest } from '@/controller';
import { saveAs } from '@/util';

jest.mock('@/util', () => {
  const originalModule = jest.requireActual('@/util');
  return {
    __esModule: true,
    ...originalModule,
    saveAs: jest.fn(), // just mock saveAs
  };
});

describe('Export.test.ts', () => {
  afterEach(cleanup);
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
      expect(saveAs).toHaveBeenCalled();
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
      expect(saveAs).toHaveBeenCalled();
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
      expect(saveAs).toHaveBeenCalled();
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
      expect(saveAs).toHaveBeenCalled();
    });
  });
});
