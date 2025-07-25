import React, { useState, memo } from 'react';
import { Button } from '../../components';
import styles from './index.module.css';
import { scrollBar } from '../../canvas';
import i18n from '../../i18n';
import { classnames, MAX_ADD_ROW_THRESHOLD } from '../../util';
import { useExcel, useScrollStore } from '../store';

const defaultData = 10;

export const BottomBar = memo(() => {
  const { controller } = useExcel();
  const [value, setValue] = useState(defaultData);
  const scrollTop = useScrollStore((s) => s.scrollTop);
  const canvasHeight = useScrollStore((s) => s.canvasHeight);
  const showBottomBar = scrollTop / canvasHeight >= 0.91;
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const val = parseInt(event.target.value, 10);
    if (!isNaN(val)) {
      if (val < 1) {
        setValue(1);
      } else if (val > MAX_ADD_ROW_THRESHOLD) {
        setValue(MAX_ADD_ROW_THRESHOLD);
      } else {
        setValue(val);
      }
    }
  };
  const handleClick = () => {
    const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
    if (!sheetInfo) {
      return;
    }
    controller.addRow(sheetInfo.rowCount - 1, value);
    const viewSize = controller.getSheetViewSize();
    scrollBar(controller, 0, viewSize.height);
  };
  return (
    <div
      className={classnames(styles['bottom-bar'], {
        [styles.active]: showBottomBar,
      })}
      data-testid="canvas-bottom-bar"
    >
      <div className={styles['bottom-bar-text']}>{i18n.t('add-at-the-bottom')}</div>
      <input
        value={value}
        onChange={handleChange}
        type="number"
        min={1}
        max={MAX_ADD_ROW_THRESHOLD}
        data-testid="canvas-bottom-bar-input"
        className={styles['bottom-bar-input']}
      />
      <div className={styles['bottom-bar-text']}>{i18n.t('rows')}</div>
      <Button
        testId="canvas-bottom-bar-add"
        className={styles['add-button']}
        onClick={handleClick}
      >
        {i18n.t('add')}
      </Button>
    </div>
  );
});

BottomBar.displayName = 'BottomBar';
