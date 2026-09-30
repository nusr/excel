import React, { memo, useCallback, useState } from 'react';
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
import {
  MenuTrigger,
  SubmenuTrigger,
  Menu,
  MenuItem,
} from '../../component/Menu';
import { Button } from '../../component/Button';

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
          <MenuTrigger data-testid="menubar-excel">
            <Button
              data-testid="menubar-excel-trigger"
              aria-label="Excel Menu Trigger"
            >
              {i18n.t('file')}
            </Button>
            <Menu aria-label="Excel Menu">
              <MenuItem
                data-testid="menubar-new-excel"
                onPress={handleAddDocument}
              >
                {i18n.t('new-file')}
              </MenuItem>
              <MenuItem
                data-testid="menubar-rename-excel"
                onPress={() => setVisible(true)}
              >
                {i18n.t('rename-file')}
              </MenuItem>

              <MenuItem data-testid="menubar-import-excel">
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
              <SubmenuTrigger data-testid="menubar-export-more">
                <MenuItem> {i18n.t('export', { format: '...' })}</MenuItem>
                <Menu aria-label="Export Menu">
                  {EXPORT_EXTENSIONS.map((ext) => (
                    <MenuItem
                      key={ext}
                      data-testid={`menubar-export-more-${ext}`}
                      onPress={() => handleExportExcel(ext)}
                    >
                      {ext.toUpperCase()}
                    </MenuItem>
                  ))}

                  <MenuItem
                    data-testid="menubar-export-json"
                    onPress={handleExportJSON}
                    key="json"
                  >
                    JSON
                  </MenuItem>
                </Menu>
              </SubmenuTrigger>
            </Menu>
          </MenuTrigger>
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
