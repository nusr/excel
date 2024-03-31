import React, {
  useState,
  useSyncExternalStore,
  memo,
  useCallback,
} from 'react';
import { Button } from '../components';
import { IController } from '@/types';
import styles from './index.module.css';
import { scrollStore } from '../store';
import { scrollBar } from '@/canvas';
import { $ } from '@/i18n';
import { classnames, sheetViewSizeSet } from '@/util';

interface Props {
  controller: IController;
}

export const BottomBar: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const { showBottomBar } = useSyncExternalStore(
      scrollStore.subscribe,
      scrollStore.getSnapshot,
    );
    const [value, setValue] = useState(10);
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const val = event.currentTarget.value;
        setValue(parseInt(val, 10));
        event.stopPropagation();
      },
      [],
    );
    const handleClick = useCallback(() => {
      const sheetInfo = controller.getSheetInfo(
        controller.getCurrentSheetId(),
      )!;
      controller.addRow(sheetInfo.rowCount - 1, value);
      const viewSize = sheetViewSizeSet.get();
      scrollBar(controller, 0, viewSize.height);
    }, []);
    return (
      <div
        className={classnames(styles['bottom-bar'], {
          [styles.active]: showBottomBar,
        })}
        data-testid="canvas-bottom-bar"
      >
        <div className={styles['bottom-bar-text']}>
          {$('add-at-the-bottom')}
        </div>
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
  },
);

BottomBar.displayName = 'BottomBar';
