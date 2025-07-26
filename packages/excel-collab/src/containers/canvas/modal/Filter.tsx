import { useState, useEffect } from 'react';
import type { IController, ModalProps, ResultType } from '../../../types';
import { MERGE_CELL_LINE_BREAK } from '../../../util';
import i18n from '../../../i18n';
import styles from './index.module.css';
import { Button } from '../../../components';
import { useExcel } from '../../../containers/store';

type FilterItem = {
  label: string;
  value: ResultType;
  checked: boolean;
  count: number;
};

function getData(
  controller: IController,
  col: number,
): { dataList: FilterItem[] } | undefined {
  const sheetId = controller.getCurrentSheetId();
  const sheetInfo = controller.getSheetInfo(sheetId);
  if (!sheetInfo) {
    return;
  }
  const filter = controller.getFilter(sheetId);
  if (!filter) {
    return;
  }
  const { range } = filter;
  let set = new Set<ResultType>();
  if (filter.value) {
    if (filter.value.type === 'normal') {
      set = new Set(filter.value.value);
    }
  }
  const map = new Map<ResultType, number>();
  const result: FilterItem[] = [];
  const end =
    range.rowCount === 0 ? sheetInfo.rowCount : range.row + range.rowCount;
  for (let r = range.row + 1; r < end; r++) {
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
        label: isUndefined ? i18n.t('filter-empty') : String(cellValue),
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
  return {
    dataList: result.map((v) => {
      const checked = set.size === 0 ? true : set.has(v.value);
      return { ...v, count: map.get(v.value) || 0, checked };
    }),
  };
}

export const FilterModal = ({ col, hide }: ModalProps) => {
  const { controller } = useExcel();
  const [dataList, setDataList] = useState<FilterItem[]>([]);
  useEffect(() => {
    const result = getData(controller, col);
    if (result) {
      setDataList(result.dataList);
    }
  }, [controller, col]);
  return (
    <div data-testid="filter-modal">
      <div className={styles['dialog-title']}>{i18n.t('filter')}</div>
      <div>
        <div>
          <label htmlFor="modal_all">
            <input
              type="checkbox"
              id="modal_all"
              name="all"
              value="all"
              data-testid="filter-model-all"
              checked={dataList.every((v) => v.checked)}
              onChange={(e) => {
                setDataList((oldList) =>
                  oldList.map((v) => ({ ...v, checked: e.target.checked })),
                );
              }}
            />
            {i18n.t('filter-all')}
          </label>
          <span>({dataList.length})</span>
        </div>
        {dataList.map((v, index) => (
          <div key={v.label} className={styles.listItem}>
            <label htmlFor={`modal_${v.label}`}>
              <input
                type="checkbox"
                id={`modal_${v.label}`}
                name={v.label}
                value={v.label}
                checked={v.checked}
                data-testid="filter-model-item"
                onChange={(e) =>
                  setDataList((oldList) => {
                    oldList[index].checked = e.target.checked;
                    return [...oldList];
                  })
                }
              />
              {v.label}
            </label>
            <span>({v.count})</span>
          </div>
        ))}
      </div>

      <div className={styles['dialog-button']}>
        <Button onClick={hide}>{i18n.t('cancel')}</Button>
        <Button
          className={styles['dialog-cancel']}
          type="primary"
          onClick={() => {
            const data = dataList.filter((v) => v.checked).map((v) => v.value);
            if (data.length === dataList.length) {
              const filter = controller.getFilter();
              if (typeof filter?.col === 'number' && filter?.value) {
                controller.updateFilter('', {
                  col: undefined,
                  value: undefined,
                });
              }
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
          {i18n.t('confirm')}
        </Button>
      </div>
    </div>
  );
};
