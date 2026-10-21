import React, { memo, useCallback, useState, useEffect, useRef } from 'react';
import {
  importExcel,
  exportExcel,
  EXPORT_EXTENSIONS,
  IMPORT_ACCEPT,
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
import { queue } from '../../component/Toast';

type Props = {
  leftChildren?: React.ReactNode;
  rightChildren?: React.ReactNode;
};

export const MenuBarContainer: React.FunctionComponent<Props> = memo(
  ({ leftChildren, rightChildren }) => {
    const { controller, provider } = useExcel();
    const [visible, setVisible] = useState(false);
    const importVersion = useRef(0);
    useEffect(() => () => { importVersion.current++; }, [controller]);
    const handleExportExcel = useCallback(async (format: ExportExtension) => {
      try {
        await exportExcel(`excel_${Date.now()}`, controller, format);
      } catch (error) {
        queue.add({ title: i18n.t('export-failed', {
          message: error instanceof Error ? error.message : String(error),
        }) });
      }
    }, [controller]);
    const handleImportExcel = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget;
        const file = input.files?.[0];
        if (!file) {
          return;
        }
        const version = ++importVersion.current;
        try {
          const model = await importExcel(file);
          if (version === importVersion.current) controller.fromJSON(model);
        } catch (error) {
          if (version === importVersion.current) queue.add({ title: i18n.t('import-failed', {
            message: error instanceof Error ? error.message : String(error),
          }) });
        } finally {
          input.value = '';
          input.blur();
        }
      },
      [controller],
    );
    const handleExportJSON = useCallback(() => {
      const blob = new Blob([JSON.stringify(controller.toJSON())], {
        type: 'application/json',
      });
      saveAs(blob, `excel_${Date.now()}.json`);
    }, [controller]);
    const handleAddDocument = useCallback(() => {
      const docId = v4();
      provider?.addDocument?.(docId);
    }, [provider]);
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
                textValue={i18n.t('new-file')}
              >
                {i18n.t('new-file')}
              </MenuItem>
              <MenuItem
                data-testid="menubar-rename-excel"
                onPress={() => setVisible(true)}
                textValue={i18n.t('rename-file')}
              >
                {i18n.t('rename-file')}
              </MenuItem>

              <MenuItem
                data-testid="menubar-import-excel"
                textValue={i18n.t('import', { format: 'File' })}
              >
                <input
                  type="file"
                  hidden
                  onChange={handleImportExcel}
                  accept={IMPORT_ACCEPT}
                  data-testid="menubar-import-input"
                  id="menubar-import-input"
                />
                <label htmlFor="menubar-import-input">
                  {i18n.t('import', { format: 'File' })}
                </label>
              </MenuItem>
              <SubmenuTrigger data-testid="menubar-export-more">
                <MenuItem textValue={i18n.t('export', { format: '...' })}>
                  {' '}
                  {i18n.t('export', { format: '...' })}
                </MenuItem>
                <Menu aria-label="Export Menu">
                  {EXPORT_EXTENSIONS.map((ext) => (
                    <MenuItem
                      key={ext}
                      data-testid={`menubar-export-more-${ext}`}
                      onPress={() => handleExportExcel(ext)}
                      textValue={ext.toUpperCase()}
                    >
                      {ext.toUpperCase()}
                    </MenuItem>
                  ))}

                  <MenuItem
                    data-testid="menubar-export-json"
                    onPress={handleExportJSON}
                    key="json"
                    textValue="JSON"
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
