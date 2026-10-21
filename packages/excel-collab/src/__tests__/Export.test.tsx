import { vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type, renderComponent } from './util';
import './global.mock';

const { mockSaveAs } = vi.hoisted(() => ({ mockSaveAs: vi.fn() }));

vi.mock('../util', async (importOriginal) => {
  const originalModule =
    await importOriginal<typeof import('../util')>();
  return {
    ...originalModule,
    saveAs: (...list: unknown[]) => mockSaveAs(...list),
  };
});

describe('Export.test.ts', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockSaveAs.mockReset();
    await renderComponent();
  });
  describe('download chart', () => {
    test('ok', async () => {
      type('1');

      fireEvent.click(screen.getByTestId('toolbar-chart'));

      expect(await screen.findAllByTestId('float-element')).toHaveLength(1);
      await waitFor(() => {
        expect(
          screen.getByTestId('float-element').querySelector('canvas[data-uuid]'),
        ).not.toBeNull();
      });
      fireEvent.contextMenu(await screen.findByTestId('float-element'), {
        clientY: 20,
        clientX: 20,
      });

      fireEvent.click(
        await screen.findByTestId('float-element-context-menu-save-as-picture'),
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
      const user = userEvent.setup();
      type('test');
      await user.click(screen.getByTestId('menubar-excel-trigger'));
      await user.hover(screen.getByRole('menuitem', { name: /export/i }));
      await user.click(await screen.findByTestId('menubar-export-more-xlsx'));
      await waitFor(() => {
        expect(mockSaveAs).toHaveBeenCalled();
      }, { timeout: 5000 });
    }, 10000);
  });
  describe('download csv', () => {
    test('ok', async () => {
      const user = userEvent.setup();
      type('test');
      await user.click(screen.getByTestId('menubar-excel-trigger'));
      await user.hover(screen.getByRole('menuitem', { name: /export/i }));
      await user.click(await screen.findByTestId('menubar-export-more-csv'));
      expect(mockSaveAs).toHaveBeenCalled();
    });
  });
  describe('download json', () => {
    test('ok', async () => {
      const user = userEvent.setup();
      type('test');
      await user.click(screen.getByTestId('menubar-excel-trigger'));
      await user.hover(screen.getByRole('menuitem', { name: /export/i }));
      await user.click(await screen.findByTestId('menubar-export-json'));
      expect(mockSaveAs).toHaveBeenCalled();
    });
  });
  describe('download other formats', () => {
    for (const ext of ['xlsb', 'xls', 'ods', 'html', 'dbf'] as const) {
      test(ext, async () => {
        const user = userEvent.setup();
        type('test');
        await user.click(screen.getByTestId('menubar-excel-trigger'));
        await user.hover(screen.getByRole('menuitem', { name: /export/i }));
        expect(screen.queryByTestId(`menubar-export-more-${ext}`)).not.toBeInTheDocument();
        expect(mockSaveAs).not.toHaveBeenCalled();
      });
    }
  });
});
