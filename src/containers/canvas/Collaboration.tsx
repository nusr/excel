import React, {
  useState,
  useSyncExternalStore,
  useEffect,
  useMemo,
} from 'react';
import { userStore, useExcel, coreStore, scrollStore } from '../store';
import { UserItem, CanvasOverlayPosition } from '../../types';
import styles from './index.module.css';
import { getRandomColor } from '../../util';

export const Collaboration = () => {
  const users = useSyncExternalStore(
    userStore.subscribe,
    userStore.getSnapshot,
  );
  const { currentSheetId } = useSyncExternalStore(
    coreStore.subscribe,
    coreStore.getSnapshot,
  );
  const userList = users.filter((v) => v?.range?.sheetId === currentSheetId);

  return (
    <React.Fragment>
      {userList.map((v) => (
        <User key={v.clientId} {...v}></User>
      ))}
    </React.Fragment>
  );
};

export const User: React.FunctionComponent<UserItem> = ({
  range,
  clientId,
}) => {
  const { controller } = useExcel();
  const color = useMemo(() => {
    return getRandomColor();
  }, []);
  const { row, col } = useSyncExternalStore(
    scrollStore.subscribe,
    scrollStore.getSnapshot,
  );
  const [position, setPosition] = useState<CanvasOverlayPosition>({
    top: -9999,
    left: -9999,
    width: 0,
    height: 0,
  });
  useEffect(() => {
    const { top, left } = controller.computeCellPosition(range);
    const width = controller.getColWidth(range.col);
    const height = controller.getRowHeight(range.row);
    setPosition({ left, top, width, height });
  }, [range, row, col]);

  return (
    <div
      className={styles.user}
      style={{ ...position, border: `2px solid ${color}` }}
    >
      <div className={styles.userContent} style={{ color }}>
        {clientId}
      </div>
    </div>
  );
};
