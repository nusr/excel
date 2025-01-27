import { screen, fireEvent, waitFor } from '@testing-library/react';
import fs from 'fs/promises';
import path from 'path';
import './global.mock';
import { renderComponent } from './util';

describe('Import.test.tsx', () => {
  beforeEach(async () => {
    await renderComponent();
  });
  describe('upload image', () => {
    test('ok', async () => {
      const file = new File(['test content'], 'test.png', {
        type: 'image/png',
      });

      fireEvent.change(screen.getByTestId('toolbar-floating-picture-input'), {
        target: { files: [file] },
      });

      expect(await screen.findAllByTestId('float-element')).toHaveLength(1);
    });
    test('empty files', () => {
      fireEvent.change(screen.getByTestId('toolbar-floating-picture-input'), {
        target: { files: [] },
      });

      expect(() => screen.getByTestId('float-element')).toThrow();
    });
    test('empty file', () => {
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      const file = new File([''], 'test.png', {
        type: 'image/png',
      });

      fireEvent.change(screen.getByTestId('menubar-import-csv-input'), {
        target: { files: [file] },
      });

      expect(() => screen.getByTestId('float-element')).toThrow();
    });
  });
  describe('upload csv', () => {
    test('ok', async () => {
      fireEvent.click(await screen.findByTestId('menubar-excel-trigger'));
      const file = new File(['test,1\n2,3'], 'test.csv', {
        type: 'text/csv',
      });
      fireEvent.change(await screen.findByTestId('menubar-import-csv-input'), {
        target: { files: [file] },
      });
      await waitFor(() => {
        expect(screen.getByTestId('formula-editor-trigger')).toHaveTextContent(
          'test',
        );
      });
    });
    test('empty', async () => {
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      const file = new File([''], 'test.csv', {
        type: 'text/csv',
      });

      fireEvent.change(screen.getByTestId('menubar-import-csv-input'), {
        target: { files: [file] },
      });

      expect(
        await screen.findByTestId('formula-editor-trigger'),
      ).toHaveTextContent('');
    });
  });
  describe('upload xlsx', () => {
    test('ok', async () => {
      fireEvent.click(await screen.findByTestId('menubar-excel-trigger'));
      const fileData = await fs.readFile(
        path.join(process.cwd(), './scripts/origin.xlsx'),
      );
      fireEvent.change(await screen.findByTestId('menubar-import-xlsx-input'), {
        target: { files: [fileData] },
      });
      await waitFor(() => {
        expect(
          screen.getByTestId('sheet-bar-list').childNodes.length,
        ).toBeGreaterThanOrEqual(5);
      });
    });
    test('empty', async () => {
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));

      fireEvent.change(screen.getByTestId('menubar-import-xlsx-input'), {
        target: { files: [] },
      });

      expect(
        await screen.findByTestId('formula-editor-trigger'),
      ).toHaveTextContent('');
    });
  });
});
