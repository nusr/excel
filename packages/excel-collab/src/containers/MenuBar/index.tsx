import React, { memo, useCallback, useState } from 'react';
import { Menu, MenuItem, SubMenu } from '../../components';
import {
  importExcel,
  exportExcel,
  EXPORT_EXTENSIONS,
  EXPORT_FORMATS,
  type ExportExtension,
} from '../Excel';
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

const ACCEPT = Object.values(EXPORT_FORMATS)
  .map((v) => v.mime)
  .join(',');

export const MenuBarContainer: React.FunctionComponent<Props> = memo(
  ({ leftChildren, rightChildren }) => {
    const { controller, provider } = useExcel();
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
            label={i18n.t('file')}
            className={styles.menu}
            testId="menubar-excel"
          >
            <MenuItem onClick={handleAddDocument} testId="menubar-new-excel">
              {i18n.t('new-file')}
            </MenuItem>
            <MenuItem
              onClick={() => setVisible(true)}
              testId="menubar-rename-excel"
            >
              {i18n.t('rename-file')}
            </MenuItem>
            <MenuItem testId="menubar-import-excel">
              <input
                type="file"
                hidden
                onChange={handleImportExcel}
                accept={ACCEPT}
                data-testid="menubar-import-input"
                id="menubar-import-input"
              />
              <label htmlFor="menubar-import-input">
                {i18n.t('import', { format: 'File' })}
              </label>
            </MenuItem>
            <SubMenu
              label={i18n.t('export', { format: '...' })}
              testId="menubar-export-more"
            >
              {EXPORT_EXTENSIONS.map((ext) => (
                <MenuItem
                  key={ext}
                  testId={`menubar-export-more-${ext}`}
                  onClick={() => handleExportExcel(ext)}
                >
                  {ext.toUpperCase()}
                </MenuItem>
              ))}

              <MenuItem
                testId="menubar-export-json"
                onClick={handleExportJSON}
                key="json"
              >
                {i18n.t('export', { format: 'JSON' })}
              </MenuItem>
            </SubMenu>
          </Menu>
          {leftChildren}
        </div>
        {rightChildren}
        <User />
        <I18N />
        <Theme />
      </div>
    );
  },
);

MenuBarContainer.displayName = 'MenuBarContainer';

export default MenuBarContainer;
