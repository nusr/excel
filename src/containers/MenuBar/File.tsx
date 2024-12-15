import React, { useSyncExternalStore, useState, useCallback } from 'react';
import { fileStore, useExcel } from '../store';
import styles from './index.module.css';
import { Dialog } from '../../components';
import { $ } from '../../i18n';

export const File = () => {
  const { provider } = useExcel();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState($('default-name'));
  const { name } = useSyncExternalStore(
    fileStore.subscribe,
    fileStore.getSnapshot,
  );
  const handleClick = useCallback(() => {
    setVisible(true);
  }, []);
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.currentTarget.value.trim());
    },
    [],
  );
  const handleOk = useCallback(() => {
    if (!value) {
      return;
    }
    provider?.updateDocument(value).then(() => {
      fileStore.setState({ name: value });
      setVisible(false);
    });
  }, [value, provider]);
  return (
    <React.Fragment>
      <div className={styles.file} onClick={handleClick}>
        {name || $('default-name')}
      </div>
      <Dialog
        title={$('change-file-name')}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        <input type="text" value={value} onChange={handleChange} autoFocus />
      </Dialog>
    </React.Fragment>
  );
};
