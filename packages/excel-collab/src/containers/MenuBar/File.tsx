import React, {
  useState,
  useCallback,
  FunctionComponent,
  useEffect,
} from 'react';
import { useExcel, useUserInfo } from '../store';
import styles from './index.module.css';
import { Dialog } from '../../components';
import i18n from '../../i18n';

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const File: FunctionComponent<Props> = ({ visible, setVisible }) => {
  const { provider, controller } = useExcel();
  const [value, setValue] = useState('');
  const fileName = useUserInfo((s) => s.fileName);
  const setFileName = useUserInfo((s) => s.setFileName);
  useEffect(() => {
    setValue(fileName || i18n.t('default-name'));
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
    provider?.updateDocument?.(controller.getHooks().doc.guid, { name: value });
    setFileName(value);
    setVisible(false);
  }, [value, provider, controller]);
  return (
    <React.Fragment>
      <div className={styles.file} onClick={handleClick}>
        {fileName || i18n.t('default-name')}
      </div>
      <Dialog
        title={i18n.t('change-file-name')}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
      >
        <input
          type="text"
          value={value}
          onChange={handleChange}
          maxLength={50}
          autoFocus
        />
      </Dialog>
    </React.Fragment>
  );
};
