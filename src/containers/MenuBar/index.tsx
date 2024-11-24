import React, { memo, useCallback } from 'react';
import { Menu, MenuItem, Button } from '../../components';
import { importXLSX, exportToXLSX, exportToCsv, importCSV } from '../Excel';
import styles from './index.module.css';
import { Theme } from './Theme';
import { $ } from '@/i18n';
import { I18N } from './I18N';
import { FPS } from './FPS';
import { saveAs, isInIframe, getDocId } from '@/util';
import { useExcel } from '../store';

export const MenuBarContainer = memo(() => {
  const { controller } = useExcel();
  const handleExportXLSX = useCallback(() => {
    exportToXLSX(`excel_${Date.now()}.xlsx`, controller);
  }, []);
  const handleExportCSV = useCallback(() => {
    const text = exportToCsv(controller);
    const blob = new Blob([text], {
      type: 'text/csv;charset=utf-8;',
    });
    saveAs(blob, `excel_${Date.now()}.csv`);
  }, []);
  const handleImportXLSX = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      const model = await importXLSX(file);
      await controller.fromJSON(model);
      event.target.value = '';
      event.target.blur();
    },
    [],
  );
  const handleImportCSV = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      await importCSV(file, controller);
      event.target.value = '';
      event.target.blur();
    },
    [],
  );
  const handleExportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(controller.toJSON())], {
      type: 'application/json',
    });
    saveAs(blob, `excel_${Date.now()}.json`);
  }, []);
  return (
    <div className={styles['menubar-container']} data-testid="menubar">
      <div className={styles['menubar-menu']}>
        <Menu label={$('file')} className={styles.menu} testId="menubar-excel">
          <MenuItem testId="menubar-import-xlsx">
            <input
              type="file"
              hidden
              onChange={handleImportXLSX}
              accept=".xlsx"
              id="import_xlsx"
              data-testid="menubar-import-xlsx-input"
            />
            <label htmlFor="import_xlsx">{$('import-xlsx')}</label>
          </MenuItem>
          <MenuItem testId="menubar-import-csv">
            <input
              type="file"
              hidden
              onChange={handleImportCSV}
              accept=".csv"
              id="import_csv"
              data-testid="menubar-import-csv-input"
            />
            <label htmlFor="import_csv">{$('import-csv')}</label>
          </MenuItem>
          <MenuItem onClick={handleExportXLSX} testId="menubar-export-xlsx">
            {$('export-xlsx')}
          </MenuItem>
          <MenuItem testId="menubar-export-csv" onClick={handleExportCSV}>
            {$('export-csv')}
          </MenuItem>
          <MenuItem testId="menubar-export-json" onClick={handleExportJSON}>
            {$('export-json')}
          </MenuItem>
        </Menu>
        {!isInIframe() && (
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => {
              location.href = `${location.origin}${location.pathname.replace(
                '/app',
                '',
              )}#${getDocId()}`;
            }}
          >
            Collaboration
          </Button>
        )}
      </div>
      <I18N />
      <Theme />
      <FPS />
    </div>
  );
});

MenuBarContainer.displayName = 'MenuBarContainer';

export default MenuBarContainer;
