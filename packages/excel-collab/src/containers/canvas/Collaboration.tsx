import React, { useState, useEffect, useMemo } from 'react';
import { useUserInfo, useExcel, useCoreStore, useScrollStore } from '../store';
import { UserItem, CanvasOverlayPosition } from '../../types';
import styles from './index.module.css';
import i18n from '../../i18n';

function getBytesFromUint32(num: number) {
  const bytes = [];
  for (let i = 0; i < 4; i++) {
    const byte = (num >> (i * 8)) & 0xff;
    bytes.push(byte);
  }
  return bytes;
}

export const Collaboration = () => {
  const users = useUserInfo((s) => s.users);
  const row = useScrollStore((s) => s.row);
  const col = useScrollStore((s) => s.col);
  const currentSheetId = useCoreStore((s) => s.currentSheetId);
  const userList = users.filter((v) => v?.range?.sheetId === currentSheetId);

  return (
    <React.Fragment>
      {userList.map((v) => (
        <User key={v.clientId} row={row} col={col} {...v}></User>
      ))}
    </React.Fragment>
  );
};

export const User: React.FunctionComponent<
  UserItem & { row: number; col: number }
> = ({ range, clientId, row, col }) => {
  const { controller } = useExcel();
  const color = useMemo(() => {
    const list = getBytesFromUint32(clientId);
    const a = Math.max(...list);
    const [r, g, b] = list.filter((v) => v !== a);
    return `rgba(${r},${g},${b},${a / 255})`;
  }, []);

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
  }, [range, row, col, controller]);

  return (
    <div
      className={styles.user}
      style={{ ...position, border: `2px solid ${color}` }}
    >
      <div className={styles.userContent} style={{ color }}>
        {`${i18n.t('user-name')} ${clientId}`}
      </div>
    </div>
  );
};
