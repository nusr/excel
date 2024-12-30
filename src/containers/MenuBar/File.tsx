import React, {
  useState,
  useCallback,
  FunctionComponent,
  useEffect,
} from 'react';
import { useExcel, useUserInfo } from '../store';
import styles from './index.module.css';
import { Dialog } from '../../components';
import { $ } from '../../i18n';

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const File: FunctionComponent<Props> = ({ visible, setVisible }) => {
  const { provider } = useExcel();
  const [value, setValue] = useState('');
  const fileName = useUserInfo((s) => s.fileName);
  const setFileName = useUserInfo((s) => s.setFileName);
  useEffect(() => {
    setValue(fileName || $('default-name'));
  }, [fileName]);
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
    provider?.updateDocument?.(provider?.getDoc?.().guid || '', value);
    setFileName(value);
    setVisible(false);
  }, [value, provider]);
  return (
    <React.Fragment>
      <div className={styles.file} onClick={handleClick}>
        {fileName || $('default-name')}
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
