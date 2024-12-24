import React, {
  useState,
  useCallback,
  FunctionComponent,
  useEffect,
} from 'react';
import { fileStore, useExcel } from '../store';
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
  const { name } = fileStore.useStore();
  useEffect(() => {
    setValue(name || $('default-name'));
  }, [name]);
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
