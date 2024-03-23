import React, { useState, useSyncExternalStore } from 'react';
import { Button } from '../components';
import { IController } from '@/types';
import styles from './index.module.css';
import { scrollStore } from '../store';
import { scrollBar } from '@/canvas';
import { $ } from '@/i18n';

interface Props {
  controller: IController;
}

export const BottomBar: React.FunctionComponent<Props> = ({ controller }) => {
  const { scrollTop } = useSyncExternalStore(
    scrollStore.subscribe,
    scrollStore.getSnapshot,
  );
  const headerSize = controller.getHeaderSize();
  const rect = controller.getDomRect();
  const [value, setValue] = useState(10);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.currentTarget.value;
    setValue(parseInt(val, 10));
    event.stopPropagation();
  };
  const handleClick = () => {
    const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId())!;
    controller.addRow(sheetInfo.rowCount - 1, value);
    const viewSize = controller.getViewSize();
    scrollBar(controller, 0, viewSize.height);
  };
  return (
    <div
      className={styles['bottom-bar']}
      data-testid="canvas-bottom-bar"
      style={{
        left: headerSize.width,
        display: scrollTop / rect.height >= 0.856 ? 'flex' : 'none',
      }}
    >
      <div className={styles['bottom-bar-text']}>{$('add-at-the-bottom')}</div>
      <input
        value={value}
        onChange={handleChange}
        type="number"
        min={1}
        max={200}
      />
      <div className={styles['bottom-bar-text']}>{$('rows')}</div>
      <Button className={styles['add-button']} onClick={handleClick}>
        {$('add')}
      </Button>
    </div>
  );
};
