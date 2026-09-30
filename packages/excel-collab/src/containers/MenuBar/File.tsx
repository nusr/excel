import React, {
  useState,
  useCallback,
  FunctionComponent,
  useEffect,
} from 'react';
import { useExcel, useUserInfo } from '../store';
import i18n from '../../i18n';
import { DialogTrigger } from 'react-aria-components/Modal';
import { Modal } from '../../component/Modal';
import { Dialog, Heading } from '../../component/Dialog';
import { Form } from '../../component/Form';
import { TextField } from '../../component/TextField';
import { Button } from '../../component/Button';

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
  const handleChange = useCallback((value: unknown) => {
    setValue(String(value).trim());
  }, []);
  const handleOk = useCallback(() => {
    if (!value) {
      return;
    }
    provider?.updateDocument?.(controller.getHooks().doc.guid, { name: value });
    setFileName(value);
    setVisible(false);
  }, [value, provider, controller]);

  const realFileName = fileName || i18n.t('default-name');

  return (
    <DialogTrigger aria-label="Change file name">
      <Button
        style={{ marginRight: 'var(--spacing-2)' }}
        variant="quiet"
        aria-label={realFileName}
        onClick={handleClick}
      >
        {realFileName}
      </Button>
      <Modal isDismissable isOpen={visible} onOpenChange={setVisible}>
        <Dialog>
          <Heading slot="title">{i18n.t('change-file-name')}</Heading>
          <Form>
            <TextField
              autoFocus
              maxLength={50}
              label="File Name"
              placeholder="Enter the file name"
              value={value}
              onChange={handleChange}
              aria-label="File Name Input"
              spellCheck="true"
            />
            <div style={{ display: 'flex', gap: 8, alignSelf: 'end' }}>
              <Button
                slot="close"
                variant="secondary"
                aria-label="Cancel"
                onPress={() => setVisible(false)}
              >
                {i18n.t('cancel')}
              </Button>
              <Button onPress={handleOk} aria-label="Confirm">
                {i18n.t('confirm')}
              </Button>
            </div>
          </Form>
        </Dialog>
      </Modal>
    </DialogTrigger>
  );
};
