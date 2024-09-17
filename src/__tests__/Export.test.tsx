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
import { initController } from '@/controller';
import './global.mock';

const mockSaveAs = jest.fn();
const mockGetImageSize = jest.fn();

jest.mock('../util/saveAs', () => {
  return {
    saveAs: (...list: any[]) => mockSaveAs(...list),
    getImageSize: (...list: any[]) => mockGetImageSize(...list),
  };
});

describe('Export.test.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSaveAs.mockReset();
    mockGetImageSize.mockReset();
  });
  describe('download chart', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initController()} />);
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
      expect(mockSaveAs).toHaveBeenCalledWith('data:,', 'Chart Title.png');
    });
  });
  describe('download floating picture', () => {
    test('ok', async () => {
      mockGetImageSize.mockResolvedValue({ width: 100, height: 100 });
      act(() => {
        render(<App controller={initController()} />);
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
      expect(mockSaveAs).toHaveBeenCalled()
      expect(mockGetImageSize).toHaveBeenCalled()
    });
  });
  describe('download xlsx', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('test');
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      fireEvent.click(screen.getByTestId('menubar-export-xlsx'));
      await waitFor(()=>{
        expect(mockSaveAs).toHaveBeenCalled()
      })
    });
  });
  describe('download csv', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      type('test');
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      fireEvent.click(screen.getByTestId('menubar-export-csv'));
      expect(mockSaveAs).toHaveBeenCalled()
    });
  });
});
