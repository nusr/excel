import React, { memo, useCallback, useState, useRef } from 'react';
import { Menu, MenuItem } from '../../components';
import { importExcel, exportExcel, type ExportExtension } from '../Excel';
import styles from './index.module.css';
import { Theme } from './Theme';
import i18n from '../../i18n';
import { I18N } from './I18N';
import { saveAs } from '../../util';
import { useExcel } from '../store';
import { User } from './User';
import { File } from './File';
import { v4 } from 'uuid';

type Props = {
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
};

export const MenuBarContainer: React.FunctionComponent<Props> = memo(
  ({ leftChildren, rightChildren }) => {
    const { controller, provider } = useExcel();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [visible, setVisible] = useState(false);
    const handleExportExcel = useCallback((format: ExportExtension) => {
      exportExcel(`excel_${Date.now()}`, controller, format);
    }, []);
    const handleImportExcel = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
          return;
        }
        const model = await importExcel(file);
        controller.fromJSON(model);
        event.target.value = '';
        event.target.blur();
      },
      [],
    );
    const triggerInput = useCallback(async () => {
      fileInputRef.current?.click();
    }, []);
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
      <>
        <input
          type="file"
          hidden
          onChange={handleImportExcel}
          accept=".xlsx,.csv"
          data-testid="menubar-import-input"
          ref={fileInputRef}
        />
        <div className={styles['menubar-container']} data-testid="menubar">
          <div className={styles['menubar-menu']}>
            <File visible={visible} setVisible={setVisible} />
            <Menu
              label={i18n.t('file')}
              className={styles.menu}
              testId="menubar-excel"
            >
              <MenuItem onClick={handleAddDocument} testId="menubar-new-excel">
                {i18n.t('new-file')}
              </MenuItem>
              <MenuItem
                onClick={() => setVisible(true)}
                testId="menubar-new-excel"
              >
                {i18n.t('rename-file')}
              </MenuItem>
              <MenuItem testId="menubar-import-xlsx" onClick={triggerInput}>
                {i18n.t('import', { format: 'XLSX' })}
              </MenuItem>
              <MenuItem testId="menubar-import-csv" onClick={triggerInput}>
                {i18n.t('import', { format: 'CSV' })}
              </MenuItem>
              <MenuItem
                onClick={() => handleExportExcel('xlsx')}
                testId="menubar-export-xlsx"
              >
                {i18n.t('export', { format: 'XLSX' })}
              </MenuItem>
              <MenuItem
                testId="menubar-export-csv"
                onClick={() => handleExportExcel('csv')}
              >
                {i18n.t('export', { format: 'CSV' })}
              </MenuItem>
              <MenuItem testId="menubar-export-json" onClick={handleExportJSON}>
                {i18n.t('export', { format: 'JSON' })}
              </MenuItem>
            </Menu>
            {leftChildren}
          </div>
          {rightChildren}
          <User />
          <I18N />
          <Theme />
        </div>
      </>
    );
  },
);

MenuBarContainer.displayName = 'MenuBarContainer';

export default MenuBarContainer;
