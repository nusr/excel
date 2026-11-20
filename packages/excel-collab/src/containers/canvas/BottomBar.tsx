import { useState, memo } from 'react';
import { Button } from '../../component/Button';
import styles from './index.module.css';
import { scrollBar } from '../../canvas';
import i18n from '../../i18n';
import { classnames, MAX_ADD_ROW_THRESHOLD } from '../../util';
import { useExcel, useScrollStore } from '../store';
import { TextField } from '../../component/TextField';

const defaultData = 10;

export const BottomBar = memo(() => {
  const { controller } = useExcel();
  const [value, setValue] = useState(defaultData);
  const scrollTop = useScrollStore((s) => s.scrollTop);
  const canvasHeight = useScrollStore((s) => s.canvasHeight);
  const showBottomBar = scrollTop / canvasHeight >= 0.91;
  const handleChange = (inputValue: string) => {
    const val = parseInt(inputValue, 10);
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
      <TextField
        value={String(value)}
        onChange={handleChange}
        inputClassName={styles['bottom-bar-input']}
        aria-label={i18n.t('rows')}
        inputProps={{
          'data-testid': 'canvas-bottom-bar-input',
          type: 'number',
          min: 1,
          max: MAX_ADD_ROW_THRESHOLD,
        }}
      />
      <div className={styles['bottom-bar-text']}>{i18n.t('rows')}</div>
      <Button
        data-testid="canvas-bottom-bar-add"
        className={styles['add-button']}
        onClick={handleClick}
        aria-label="Add Row"
      >
        {i18n.t('add')}
      </Button>
    </div>
  );
});

BottomBar.displayName = 'BottomBar';
