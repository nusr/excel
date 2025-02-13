import React, { memo, useCallback, useState } from 'react';
import { Menu, MenuItem } from '../../components';
import { importXLSX, exportToXLSX, exportToCsv, importCSV } from '../Excel';
import styles from './index.module.css';
import { Theme } from './Theme';
import { $ } from '../../i18n';
import { I18N } from './I18N';
import { saveAs } from '../../util';
import { useExcel } from '../store';
import { User } from './User';
import { ProviderStatus } from '../../types';
import { File } from './File';
import { v4 } from 'uuid';

type Props = {
  providerStatus?: ProviderStatus;
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
};

export const MenuBarContainer: React.FunctionComponent<Props> = memo(
  ({ providerStatus = ProviderStatus.LOCAL, leftChildren, rightChildren }) => {
    const { controller, provider } = useExcel();
    const [visible, setVisible] = useState(false);
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
    const handleAddDocument = useCallback(() => {
      const docId = v4();
      provider?.addDocument?.(docId);
    }, []);
    return (
      <div className={styles['menubar-container']} data-testid="menubar">
        <div className={styles['menubar-menu']}>
          <File visible={visible} setVisible={setVisible} />
          <Menu
            label={$('file')}
            className={styles.menu}
            testId="menubar-excel"
          >
            <MenuItem onClick={handleAddDocument} testId="menubar-new-excel">
              {$('new-file')}
            </MenuItem>
            <MenuItem
              onClick={() => setVisible(true)}
              testId="menubar-new-excel"
            >
              {$('rename-file')}
            </MenuItem>
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
          {leftChildren}
        </div>
        {rightChildren}
        <User providerStatus={providerStatus} />
        <I18N />
        <Theme />
      </div>
    );
  },
);

MenuBarContainer.displayName = 'MenuBarContainer';

export default MenuBarContainer;
