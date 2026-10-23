import type {
  AutoFilterItem,
  FilterCondition,
  FilterValue,
  ModelCellType,
  ResultType,
} from '../types';
import { MERGE_CELL_LINE_BREAK } from './constant';

export function filterCellValue(cell?: ModelCellType): ResultType {
  return cell?.value ?? '';
}

export function getFilterCriteria(filter?: AutoFilterItem): Record<string, FilterValue> {
  return (
    filter?.filters ??
    (filter?.col !== undefined && filter.value ? { [filter.col]: filter.value } : {})
  );
}

function matchesCondition(value: ResultType, condition: FilterCondition): boolean {
  const blank = value === '' || value === null || value === undefined;
  if (condition.operator === 'empty') return blank;
  if (condition.operator === 'notEmpty') return !blank;
  const text = String(value ?? '').toLocaleLowerCase();
  const operand = String(condition.value ?? '').toLocaleLowerCase();
  switch (condition.operator) {
    case 'equal':
      return typeof condition.value === 'number'
        ? typeof value === 'number' && value === condition.value
        : text === operand;
    case 'notEqual':
      return !matchesCondition(value, { ...condition, operator: 'equal' });
    case 'contains':
      return text.includes(operand);
    case 'notContains':
      return !text.includes(operand);
    case 'startsWith':
      return text.startsWith(operand);
    case 'endsWith':
      return text.endsWith(operand);
  }
  if (
    blank ||
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    condition.value === '' ||
    condition.value === undefined
  )
    return false;
  const first = Number(condition.value);
  if (!Number.isFinite(first)) return false;
  switch (condition.operator) {
    case 'greaterThan':
      return value > first;
    case 'greaterThanOrEqual':
      return value >= first;
    case 'lessThan':
      return value < first;
    case 'lessThanOrEqual':
      return value <= first;
    case 'between':
    case 'notBetween': {
      if (condition.value2 === '' || condition.value2 === undefined) return false;
      const second = Number(condition.value2);
      if (!Number.isFinite(second)) return false;
      const inside = value >= Math.min(first, second) && value <= Math.max(first, second);
      return condition.operator === 'between' ? inside : !inside;
    }
    default:
      return false;
  }
}

export function matchesFilter(cell: ModelCellType | undefined, filter: FilterValue): boolean {
  const value = filterCellValue(cell);
  switch (filter.type) {
    case 'normal':
      return filter.value.some(
        (selected) => selected === value || (selected === MERGE_CELL_LINE_BREAK && value === ''),
      );
    case 'text':
      return filter.value.every((condition) =>
        matchesCondition(value, {
          operator: condition.type as FilterCondition['operator'],
          value: condition.value,
        }),
      );
    case 'number':
      return filter.value.every((condition) =>
        matchesCondition(value, {
          operator: condition.type as FilterCondition['operator'],
          value: condition.value,
        }),
      );
    case 'color':
      return (
        (
          (filter.colorType === 'fontColor' ? cell?.fontColor : cell?.fillColor) || ''
        ).toLowerCase() === filter.value.toLowerCase()
      );
    case 'custom':
      return (
        filter.conditions.length > 0 &&
        (filter.operator === 'or'
          ? filter.conditions.some((condition) => matchesCondition(value, condition))
          : filter.conditions.every((condition) => matchesCondition(value, condition)))
      );
    default:
      return true;
  }
}
