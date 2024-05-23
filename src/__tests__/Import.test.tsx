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
import { initController } from '@/controller';
import fs from 'fs/promises';
import path from 'path';
import './global.mock';

describe('Import.test.tsx', () => {
  describe('upload image', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const file = new File(['test content'], 'test.png', {
        type: 'image/png',
      });
      act(() => {
        fireEvent.change(screen.getByTestId('toolbar-floating-picture-input'), {
          target: { files: [file] },
        });
      });
      await waitFor(() => {
        expect(screen.getAllByTestId('float-element')).toHaveLength(1);
      });
    });
    test('empty files', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      act(() => {
        fireEvent.change(screen.getByTestId('toolbar-floating-picture-input'), {
          target: { files: [] },
        });
      });
      expect(() => screen.getByTestId('float-element')).toThrow();
    });
    test('empty file', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      const file = new File([''], 'test.png', {
        type: 'image/png',
      });
      act(() => {
        fireEvent.change(screen.getByTestId('menubar-import-csv-input'), {
          target: { files: [file] },
        });
      });
      expect(() => screen.getByTestId('float-element')).toThrow();
    });
  });
  describe('upload csv', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      const file = new File(['test,1\n2,3'], 'test.csv', {
        type: 'text/csv',
      });
      act(() => {
        fireEvent.change(screen.getByTestId('menubar-import-csv-input'), {
          target: { files: [file] },
        });
      });
      await waitFor(() => {
        expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
          'test',
        );
      });
    });
    test('empty', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      const file = new File([''], 'test.csv', {
        type: 'text/csv',
      });
      act(() => {
        fireEvent.change(screen.getByTestId('menubar-import-csv-input'), {
          target: { files: [file] },
        });
      });
      await waitFor(() => {
        expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
          '',
        );
      });
    });
  });
  describe('upload xlsx', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      const fileData = await fs.readFile(
        path.join(process.cwd(), './scripts/origin.xlsx'),
      );
      act(() => {
        fireEvent.change(screen.getByTestId('menubar-import-xlsx-input'), {
          target: { files: [fileData] },
        });
      });
      await waitFor(() => {
        expect(
          screen.getByTestId('sheet-bar-list').childNodes.length,
        ).toBeGreaterThanOrEqual(5);
      });
    });
    test('empty', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      act(() => {
        fireEvent.change(screen.getByTestId('menubar-import-xlsx-input'), {
          target: { files: [] },
        });
      });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
        '',
      );
    });
  });
});
