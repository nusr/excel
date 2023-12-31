import React, { useEffect, useState, useRef } from 'react';
import { IController } from '@/types';
import styles from './index.module.css';
import { parseReference } from '@/util';

interface Props {
  controller: IController;
  displayName: string;
}

export const DefineName: React.FunctionComponent<Props> = ({
  controller,
  displayName,
}) => {
  const ref = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(displayName);
  useEffect(() => {
    setValue(displayName);
  }, [displayName]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      const t = event.currentTarget.value.toLowerCase();
      ref.current?.blur();
      const range = controller.checkDefineName(t);
      if (range) {
        setValue(displayName);
        controller.setActiveCell(range);
        return;
      }
      const r = parseReference(t);
      const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId());
      if (r && r.col < sheetInfo.colCount && r.row < sheetInfo.rowCount) {
        setValue(displayName);
        controller.setActiveCell(r);
        return;
      }
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(t) && t.length <= 255) {
        controller.setDefineName(controller.getActiveCell(), t);
      } else {
        setValue(displayName);
      }
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };
  return (
    <div className={styles['formula-bar-name']} data-testid="formula-bar-name">
      <input
        value={value}
        ref={ref}
        onChange={handleChange}
        className={styles['formula-bar-name-editor']}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};
