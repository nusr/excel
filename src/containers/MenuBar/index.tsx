import React, { useRef } from 'react';
import { IController } from '@/types';
import { Menu, MenuItem, SubMenu, Button } from '../components';
import { importXLSX } from '../Excel/import';
import { exportToXLSX } from '../Excel/exportXLSX';
import { exportToCsv } from '../Excel/exportCSV';
import styles from './index.module.css';
import { Theme } from './Theme';
import { $ } from '@/i18n';
import { I18N } from './I18N';
import { FPS } from './FPS';

interface Props {
  controller: IController;
}
const menuStyle = { width: 150, flex: 1 };

export const MenuBarContainer: React.FunctionComponent<Props> = ({
  controller,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const handleExportXLSX = () => {
    exportToXLSX(`excel_${Date.now()}.xlsx`, controller);
  };
  const handleExportCSV = () => {
    exportToCsv(`excel_${Date.now()}.csv`, controller);
  };
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const model = await importXLSX(file);
    controller.fromJSON(model);
    ref.current!.value = '';
    ref.current!.blur();
  };

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
      <Theme
        toggleTheme={() => controller.setChangeSet(new Set(['cellStyle']))}
      />
      <FPS />
    </div>
  );
};
