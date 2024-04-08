import React, { useRef, memo, useCallback } from 'react';
import { IController } from '@/types';
import { Menu, MenuItem, SubMenu, Button } from '../components';
import { importXLSX, exportToXLSX, exportToCsv } from '../Excel';
import styles from './index.module.css';
import { Theme } from './Theme';
import { $ } from '@/i18n';
import { I18N } from './I18N';
import { FPS } from './FPS';
import { saveAs } from '@/util';

interface Props {
  controller: IController;
}
const menuStyle = { width: 150, flex: 1 };

export const MenuBarContainer: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const ref = useRef<HTMLInputElement>(null);

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
    const handleImport = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        const file = event.target.files?.[0];
        if (!file) {
          return;
        }
        const model = await importXLSX(file);
        await controller.fromJSON(model);
        if (ref.current) {
          ref.current.value = '';
          ref.current.blur();
        }
      },
      [],
    );

    return (
      <div className={styles['menubar-container']} data-testid="menubar">
        <div className={styles['menubar-menu']}>
          <Menu
            menuButton={<Button>{$('menu')}</Button>}
            style={menuStyle}
            testId="menubar-excel"
          >
            <MenuItem testId="menubar-import-xlsx">
              <input
                type="file"
                hidden
                onChange={handleImport}
                accept=".xlsx"
                ref={ref}
                id="import_xlsx"
                data-testid="menubar-import-xlsx-input"
              />
              <label htmlFor="import_xlsx">{$('import-xlsx')}</label>
            </MenuItem>
            <SubMenu label="Export" style={menuStyle} testId="menubar-export">
              <MenuItem onClick={handleExportXLSX} testId="menubar-export-xlsx">
                {$('export-xlsx')}
              </MenuItem>
              <MenuItem testId="menubar-export-csv" onClick={handleExportCSV}>
                {$('export-csv')}
              </MenuItem>
            </SubMenu>
          </Menu>
        </div>
        <I18N />
        <Theme />
        <FPS />
      </div>
    );
  },
);

MenuBarContainer.displayName = 'MenuBarContainer';
