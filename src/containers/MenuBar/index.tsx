import React, { useRef } from 'react';
import { IController } from '@/types';
import { Menu, MenuItem, SubMenu, Button } from '../components';
import { importXLSX } from '../Excel/import';
import { exportToXLSX } from '../Excel/exportXLSX';
import { exportToCsv } from '../Excel/exportCSV';
import styles from './index.module.css';

interface Props {
  controller: IController;
}
const menuStyle = { width: 150 };
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
    <div className={styles.menubar} data-testid="menubar">
      <div
        onClick={() => {
          const list = new Array(1000).fill(0);
          list.map(() => controller.paste());
        }}
      >
        test
      </div>
      <Menu
        menuButton={<Button>Menu</Button>}
        style={menuStyle}
        testId="menubar-excel"
      >
        <MenuItem testId="menubar-import-xlsx">
          <input
            type="file"
            style={{ display: 'none' }}
            onChange={handleImport}
            accept=".xlsx"
            ref={ref}
            id="import_xlsx"
          />
          <label htmlFor="import_xlsx">import XLSX</label>
        </MenuItem>
        <SubMenu label="Export" style={menuStyle} testId="menubar-export">
          <MenuItem onClick={handleExportXLSX} testId="menubar-export-xlsx">
            Export XLSX
          </MenuItem>
          <MenuItem testId="menubar-export-csv" onClick={handleExportCSV}>
            Export CSV
          </MenuItem>
        </SubMenu>
      </Menu>
    </div>
  );
};
