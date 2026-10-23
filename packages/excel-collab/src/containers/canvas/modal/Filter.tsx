import { useState, useEffect } from 'react';
import { FilterX } from 'lucide-react';
import type {
  IController,
  ModalProps,
  ResultType,
  FilterValue,
  FilterCondition,
  FilterOperator,
} from '../../../types';
import { filterCellValue, getFilterCriteria, matchesFilter, intToColumnName } from '../../../util';
import { numberFormat } from '../../../formula';
import i18n, { type TranslationKeys } from '../../../i18n';
import styles from './index.module.css';
import { Button } from '../../../component/Button';
import { Checkbox } from '../../../component/Checkbox';
import { useExcel } from '../../../containers/store';
import { TextField } from '../../../component/TextField';
import { Select, SelectItem } from '../../../component/Select';

type FilterItem = {
  key: string;
  label: string;
  value: ResultType;
  checked: boolean;
  count: number;
};

type Mode = 'values' | 'text' | 'number' | 'color';
const textOperators: FilterOperator[] = [
  'equal',
  'notEqual',
  'contains',
  'notContains',
  'startsWith',
  'endsWith',
  'empty',
  'notEmpty',
];
const numberOperators: FilterOperator[] = [
  'equal',
  'notEqual',
  'greaterThan',
  'greaterThanOrEqual',
  'lessThan',
  'lessThanOrEqual',
  'between',
  'notBetween',
  'empty',
  'notEmpty',
];
const operatorLabel = (operator: FilterOperator): TranslationKeys =>
  operator === 'empty' ? 'filter-empty-condition' : `filter-${operator}`;
const needsValue = (operator: FilterOperator) => operator !== 'empty' && operator !== 'notEmpty';
const needsRange = (operator: FilterOperator) =>
  operator === 'between' || operator === 'notBetween';

function getData(
  controller: IController,
  col: number,
):
  | {
      dataList: FilterItem[];
      colors: Record<'fillColor' | 'fontColor', string[]>;
      criterion?: FilterValue;
    }
  | undefined {
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
  const criteria = getFilterCriteria(filter);
  const criterion = criteria[col];
  const map = new Map<ResultType, FilterItem>();
  const colors = { fillColor: new Set<string>(), fontColor: new Set<string>() };
  const result: FilterItem[] = [];
  const end = range.rowCount === 0 ? sheetInfo.rowCount : range.row + range.rowCount;
  for (let r = range.row + 1; r < end; r++) {
    const cellInfo = controller.getCell({
      row: r,
      col,
      rowCount: 1,
      colCount: 1,
      sheetId,
    });
    if (
      Object.entries(criteria).some(
        ([column, rule]) =>
          Number(column) !== col &&
          !matchesFilter(
            controller.getCell({ row: r, col: Number(column), rowCount: 1, colCount: 1, sheetId }),
            rule,
          ),
      )
    )
      continue;
    colors.fillColor.add(cellInfo?.fillColor?.toLowerCase() || '');
    colors.fontColor.add(cellInfo?.fontColor?.toLowerCase() || '');
    const cellValue = filterCellValue(cellInfo);
    let item = map.get(cellValue);
    if (!item) {
      item = {
        key: `${typeof cellValue}:${JSON.stringify(cellValue)}`,
        checked: criterion ? matchesFilter(cellInfo, criterion) : true,
        label:
          cellValue === ''
            ? i18n.t('filter-empty')
            : numberFormat(cellValue, cellInfo?.numberFormat),
        value: cellValue,
        count: 0,
      };
      map.set(cellValue, item);
      result.push(item);
    }
    item.count++;
  }

  const index = result.findIndex((item) => item.value === '');
  if (index >= 0) {
    result.unshift(...result.splice(index, 1));
  }
  return {
    dataList: result,
    colors: { fillColor: [...colors.fillColor], fontColor: [...colors.fontColor] },
    criterion,
  };
}

export const FilterModal = ({ col, hide }: ModalProps) => {
  const { controller } = useExcel();
  const [dataList, setDataList] = useState<FilterItem[]>([]);
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState<Mode>('values');
  const [conditions, setConditions] = useState<FilterCondition[]>([
    { operator: 'contains', value: '' },
  ]);
  const [join, setJoin] = useState<'and' | 'or'>('and');
  const [second, setSecond] = useState(false);
  const [colorType, setColorType] = useState<'fillColor' | 'fontColor'>('fillColor');
  const [color, setColor] = useState('');
  const [colors, setColors] = useState<Record<'fillColor' | 'fontColor', string[]>>({
    fillColor: [],
    fontColor: [],
  });
  useEffect(() => {
    const result = getData(controller, col);
    if (result) {
      setDataList(result.dataList);
      setColors(result.colors);
      const criterion = result.criterion;
      setSearch('');
      setMode(
        criterion?.type === 'custom'
          ? criterion.conditions.some((condition) => typeof condition.value === 'number')
            ? 'number'
            : 'text'
          : criterion?.type === 'color'
            ? 'color'
            : 'values',
      );
      if (criterion?.type === 'custom') {
        setConditions(criterion.conditions);
        setJoin(criterion.operator);
        setSecond(criterion.conditions.length > 1);
      }
      if (criterion?.type === 'color') {
        setColorType(criterion.colorType);
        setColor(criterion.value);
      }
    }
    return controller.on('renderChange', ({ changeSet }) => {
      if (
        !changeSet.has('worksheets') &&
        !changeSet.has('autoFilter') &&
        !changeSet.has('workbook')
      )
        return;
      const next = getData(controller, col);
      if (!next) {
        hide();
        return;
      }
      setDataList((previous) => {
        const selected = new Map(previous.map((item) => [item.key, item.checked]));
        return next.dataList.map((item) => ({
          ...item,
          checked: selected.get(item.key) ?? item.checked,
        }));
      });
      setColors(next.colors);
    });
  }, [controller, col]);
  const visible = dataList.filter((item) =>
    item.label.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
  );
  const selected = visible.filter((item) => item.checked).length;
  const activeConditions = second ? conditions : conditions.slice(0, 1);
  const invalidNumber =
    mode === 'number' &&
    activeConditions.some(
      (condition) =>
        needsValue(condition.operator) &&
        (condition.value === '' ||
          condition.value === undefined ||
          !Number.isFinite(Number(condition.value)) ||
          (needsRange(condition.operator) &&
            (condition.value2 === '' ||
              condition.value2 === undefined ||
              !Number.isFinite(Number(condition.value2))))),
    );
  const updateCondition = (index: number, patch: Partial<FilterCondition>) => {
    setConditions((previous) =>
      previous.map((condition, offset) =>
        offset === index ? { ...condition, ...patch } : condition,
      ),
    );
  };
  const clear = (all: boolean) => {
    controller.updateFilter(
      '',
      all ? { col: undefined, value: undefined } : { col, value: undefined },
    );
    hide();
  };
  const apply = () => {
    let value: FilterValue | undefined;
    if (mode === 'values') {
      const values = dataList
        .filter((item) => item.checked && (!search || visible.includes(item)))
        .map((item) => item.value);
      if (values.length !== dataList.length) value = { type: 'normal', value: values };
    } else if (mode === 'color') {
      value = { type: 'color', colorType, value: color };
    } else {
      value = {
        type: 'custom',
        operator: join,
        conditions: activeConditions.map((condition) => ({
          ...condition,
          ...(mode === 'number' && needsValue(condition.operator)
            ? {
                value: Number(condition.value),
                ...(needsRange(condition.operator) ? { value2: Number(condition.value2) } : {}),
              }
            : {}),
        })),
      };
    }
    controller.updateFilter('', { col, value });
    hide();
  };
  return (
    <div
      data-testid="filter-modal"
      className={styles.filterPanel}
      role="dialog"
      aria-label={`${i18n.t('filter')} ${intToColumnName(col)}`}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          hide();
        }
      }}
    >
      <div className={styles.filterHeader}>
        <strong>
          {i18n.t('filter')} · {intToColumnName(col)}
        </strong>
        <Button
          variant="quiet"
          aria-label={i18n.t('filter-clear-column')}
          onPress={() => clear(false)}
          isDisabled={!getFilterCriteria(controller.getFilter())[col]}
        >
          <FilterX size={16} />
        </Button>
      </div>
      <Select
        label={i18n.t('filter-mode')}
        data-testid="filter-mode"
        value={mode}
        onChange={(key) => {
          const next = key as Mode;
          setMode(next);
          if (next === 'number' || next === 'text') {
            setConditions([
              { operator: next === 'number' ? 'greaterThan' : 'contains', value: '' },
            ]);
            setSecond(false);
          }
        }}
      >
        <SelectItem id="values">{i18n.t('filter-values')}</SelectItem>
        <SelectItem id="text">{i18n.t('filter-text')}</SelectItem>
        <SelectItem id="number">{i18n.t('filter-number')}</SelectItem>
        <SelectItem id="color">{i18n.t('filter-color')}</SelectItem>
      </Select>
      {mode === 'values' && (
        <>
          <TextField
            aria-label={i18n.t('filter-search')}
            placeholder={i18n.t('filter-search')}
            data-testid="filter-search"
            value={search}
            onChange={setSearch}
          />
          <div className={styles.filterSelection}>
            <Checkbox
              data-testid="filter-model-all"
              isSelected={visible.length > 0 && selected === visible.length}
              isIndeterminate={selected > 0 && selected < visible.length}
              isDisabled={visible.length === 0}
              onChange={(isSelected) => {
                setDataList((oldList) =>
                  oldList.map((item) =>
                    visible.includes(item) ? { ...item, checked: isSelected } : item,
                  ),
                );
              }}
            >
              {i18n.t('filter-all')}
            </Checkbox>
            <span>{i18n.t('filter-selection-count', { selected, total: visible.length })}</span>
          </div>
          <div className={styles.filterValues}>
            {visible.length === 0 && (
              <div className={styles.filterEmpty}>{i18n.t('filter-no-results')}</div>
            )}
            {visible.map((v) => (
              <div key={v.key} className={styles.filterValue}>
                <Checkbox
                  data-testid="filter-model-item"
                  isSelected={v.checked}
                  onChange={(isSelected) =>
                    setDataList((oldList) => {
                      return oldList.map((item) =>
                        item.key === v.key ? { ...item, checked: isSelected } : item,
                      );
                    })
                  }
                >
                  {v.label}
                </Checkbox>
                <span>({v.count})</span>
              </div>
            ))}
          </div>
        </>
      )}
      {(mode === 'text' || mode === 'number') && (
        <div className={styles.filterConditions}>
          {activeConditions.map((condition, index) => (
            <div key={index} className={styles.filterCondition}>
              {index === 1 && (
                <Select
                  aria-label={i18n.t('filter-and')}
                  data-testid="filter-join"
                  value={join}
                  onChange={(key) => setJoin(key as 'and' | 'or')}
                >
                  <SelectItem id="and">{i18n.t('filter-and')}</SelectItem>
                  <SelectItem id="or">{i18n.t('filter-or')}</SelectItem>
                </Select>
              )}
              <Select
                aria-label={`${i18n.t('filter-operator')} ${index + 1}`}
                data-testid={`filter-operator-${index}`}
                value={condition.operator}
                onChange={(key) => updateCondition(index, { operator: key as FilterOperator })}
              >
                {(mode === 'number' ? numberOperators : textOperators).map((operator) => (
                  <SelectItem id={operator} key={operator}>
                    {i18n.t(operatorLabel(operator))}
                  </SelectItem>
                ))}
              </Select>
              {needsValue(condition.operator) && (
                <TextField
                  aria-label={`${i18n.t('filter-condition-value')} ${index + 1}`}
                  inputMode={mode === 'number' ? 'decimal' : 'text'}
                  value={String(condition.value ?? '')}
                  onChange={(value) => updateCondition(index, { value })}
                  data-testid={`filter-condition-value-${index}`}
                />
              )}
              {needsRange(condition.operator) && (
                <TextField
                  aria-label={i18n.t('filter-condition-value2')}
                  inputMode="decimal"
                  value={String(condition.value2 ?? '')}
                  onChange={(value2) => updateCondition(index, { value2 })}
                  data-testid="filter-upper-bound"
                />
              )}
            </div>
          ))}
          <Checkbox
            isSelected={second}
            onChange={(checked) => {
              setSecond(checked);
              if (conditions.length < 2)
                setConditions((previous) => [
                  ...previous,
                  {
                    operator: mode === 'number' ? 'lessThan' : 'contains',
                    value: '',
                  },
                ]);
            }}
          >
            {i18n.t('filter-second-condition')}
          </Checkbox>
          {invalidNumber && (
            <div role="status" className={styles.filterError}>
              {i18n.t('filter-error-number')}
            </div>
          )}
        </div>
      )}
      {mode === 'color' && (
        <div className={styles.filterConditions}>
          <Select
            aria-label={i18n.t('filter-color')}
            data-testid="filter-color-type"
            value={colorType}
            onChange={(key) => {
              setColorType(key as typeof colorType);
              setColor('');
            }}
          >
            <SelectItem id="fillColor">{i18n.t('filter-fill-color')}</SelectItem>
            <SelectItem id="fontColor">{i18n.t('filter-font-color')}</SelectItem>
          </Select>
          <div className={styles.filterColors} role="group" aria-label={i18n.t('filter-color')}>
            {colors[colorType].map((value) => (
              <button
                type="button"
                key={value}
                className={styles.filterSwatch}
                aria-label={value || i18n.t('filter-no-color')}
                aria-pressed={color === value}
                title={value || i18n.t('filter-no-color')}
                style={{ backgroundColor: value || 'transparent' }}
                onClick={() => setColor(value)}
              >
                {color === value && <span aria-hidden="true" className={styles.filterSwatchMark} />}
              </button>
            ))}
          </div>
        </div>
      )}
      <Button
        variant="quiet"
        aria-label={i18n.t('filter-clear-all')}
        onPress={() => clear(true)}
        isDisabled={Object.keys(getFilterCriteria(controller.getFilter())).length === 0}
      >
        <FilterX size={16} />
        {i18n.t('filter-clear-all')}
      </Button>
      <div className={styles['dialog-button']}>
        <Button onPress={hide} aria-label={i18n.t('cancel')}>
          {i18n.t('cancel')}
        </Button>
        <Button
          aria-label={i18n.t('confirm')}
          className={styles['dialog-cancel']}
          variant="primary"
          isDisabled={
            invalidNumber ||
            (mode === 'values' && visible.length === 0) ||
            (mode === 'color' && !colors[colorType].includes(color))
          }
          onPress={apply}
        >
          {i18n.t('confirm')}
        </Button>
      </div>
    </div>
  );
};
