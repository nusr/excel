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
import { initControllerForTest } from '@/controller';
import fs from 'fs/promises';
import path from 'path';
import { sleep } from '@/util';
import './global.mock';

describe('Import.test.tsx', () => {
  describe('upload image', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
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
        render(<App controller={initControllerForTest()} />);
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
        render(<App controller={initControllerForTest()} />);
      });
      const file = new File([''], 'test.png', {
        type: 'image/png',
      });
      act(() => {
        fireEvent.change(screen.getByTestId('toolbar-floating-picture-input'), {
          target: { files: [file] },
        });
      });
      expect(() => screen.getByTestId('float-element')).toThrow();
    });
  });
  describe('upload xlsx', () => {
    test('ok', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.click(screen.getByTestId('menubar-excel'));
      const fileData = await fs.readFile(path.join(__dirname, './origin.xlsx'));
      act(() => {
        fireEvent.change(screen.getByTestId('menubar-import-xlsx-input'), {
          target: { files: [fileData] },
        });
      });
      await sleep(100);
      await waitFor(() => {
        expect(
          screen.getByTestId('formula-editor-trigger').textContent,
        ).toEqual('=SUM(A1,B1)');
      });
    });
    test('empty', async () => {
      act(() => {
        render(<App controller={initControllerForTest()} />);
      });
      fireEvent.click(screen.getByTestId('menubar-excel'));
      act(() => {
        fireEvent.change(screen.getByTestId('menubar-import-xlsx-input'), {
          target: { files: [] },
        });
      });
      expect(screen.getByTestId('formula-editor-trigger').textContent).toEqual(
        '',
      );
    });
  });
});
