import React, { useState, useEffect } from 'react';
import type { ModalProps, ResultType } from '@/types';
import { MERGE_CELL_LINE_BREAK } from '@/util';
import { $ } from '@/i18n';
import styles from './index.module.css';
import { Button } from '@/components';

type FilterItem = {
  label: string;
  value: ResultType;
  checked: boolean;
  count: number;
};

export const FilterModal = ({ controller, col, hide }: ModalProps) => {
  const [dataList, setDataList] = useState<FilterItem[]>([]);
  useEffect(() => {
    const sheetId = controller.getCurrentSheetId();
    const sheetInfo = controller.getSheetInfo(sheetId);
    if (!sheetInfo) {
      return;
    }
    const filter = controller.getFilter(sheetId);
    if (!filter) {
      return;
    }
    const map = new Map<ResultType, number>();
    const result: FilterItem[] = [];
    for (
      let r = filter.range.row,
        end =
          filter.range.rowCount === 0
            ? sheetInfo.rowCount
            : filter.range.row + filter.range.rowCount;
      r < end;
      r++
    ) {
      const cellInfo = controller.getCell({
        row: r,
        col,
        rowCount: 1,
        colCount: 1,
        sheetId,
      });
      const cellValue = cellInfo ? cellInfo?.value : MERGE_CELL_LINE_BREAK;
      const isUndefined = cellInfo?.value === undefined;

      if (!map.has(cellValue)) {
        result.push({
          checked: true,
          label: isUndefined ? $('filter-empty') : String(cellValue),
          value: cellValue,
          count: 1,
        });
      }
      map.set(cellValue, (map.get(cellValue) || 0) + 1);
    }

    const index = result.findIndex((v) => v.value === MERGE_CELL_LINE_BREAK);
    if (index >= 0) {
      result.unshift(...result.splice(index, 1));
    }
    setDataList(result.map((v) => ({ ...v, count: map.get(v.value) || 0 })));
  }, [controller, col]);
  return (
    <div>
      <div className={styles['dialog-title']}>{$('filter')}</div>
      <div>
        <div>
          <input
            type="checkbox"
            id="modal_all"
            name="all"
            value="all"
            checked={dataList.every((v) => v.checked)}
            onChange={(e) => {
              setDataList((oldList) =>
                oldList.map((v) => ({ ...v, checked: e.target.checked })),
              );
            }}
          />
          <label htmlFor="modal_all">{$('filter-all')} </label>
        </div>
        {dataList.map((v, index) => (
          <div key={v.label} className={styles.listItem}>
            <input
              type="checkbox"
              id={`modal_${v.label}`}
              name={v.label}
              value={v.label}
              checked={v.checked}
              onChange={(e) =>
                setDataList((oldList) => {
                  oldList[index].checked = e.target.checked;
                  return [...oldList];
                })
              }
            />
            <label htmlFor={`modal_${v.label}`}>{v.label}</label>
            <span>({v.count})</span>
          </div>
        ))}
      </div>

      <div className={styles['dialog-button']}>
        <Button onClick={hide}>{$('cancel')}</Button>
        <Button
          className={styles['dialog-cancel']}
          type="primary"
          onClick={() => {
            const data = dataList.filter((v) => v.checked).map((v) => v.value);
            if (data.length === dataList.length) {
              hide();
              return;
            }
            controller.updateFilter('', {
              col,
              value: { type: 'normal', value: data },
            });
            hide();
          }}
        >
          {$('confirm')}
        </Button>
      </div>
    </div>
  );
};
