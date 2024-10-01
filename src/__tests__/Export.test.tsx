import { screen, fireEvent, waitFor } from '@testing-library/react';
import { type, renderComponent } from './util';
import './global.mock';

const mockSaveAs = jest.fn();

jest.mock('../util/saveAs', () => {
  return {
    saveAs: (...list: unknown[]) => mockSaveAs(...list),
  };
});

describe('Export.test.ts', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockSaveAs.mockReset();
    renderComponent();
    await screen.findByTestId('formula-editor-trigger');
  });
  describe('download chart', () => {
    test('ok', async () => {
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
      const file = new File(['test content'], 'test.png', {
        type: 'image/png',
      });
      fireEvent.change(screen.getByTestId('toolbar-floating-picture-input'), {
        target: { files: [file] },
      });

      expect(await screen.findAllByTestId('float-element')).toHaveLength(1);

      fireEvent.contextMenu(screen.getByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });

      fireEvent.click(
        screen.getByTestId('float-element-context-menu-save-as-picture'),
      );
      expect(mockSaveAs).toHaveBeenCalled();
    });
  });
  describe('download xlsx', () => {
    test('ok', async () => {
      type('test');
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      fireEvent.click(screen.getByTestId('menubar-export-xlsx'));
      await waitFor(() => {
        expect(mockSaveAs).toHaveBeenCalled();
      });
    });
  });
  describe('download csv', () => {
    test('ok', async () => {
      type('test');
      fireEvent.click(screen.getByTestId('menubar-excel-trigger'));
      fireEvent.click(screen.getByTestId('menubar-export-csv'));
      expect(mockSaveAs).toHaveBeenCalled();
    });
  });
});
