import {
  Array as YArray,
  Doc,
  Map as YMap,
  createRelativePositionFromTypeIndex,
  createAbsolutePositionFromRelativePosition,
  encodeRelativePosition,
  decodeRelativePosition,
  type AbstractType,
} from 'yjs';
import { v4 } from 'uuid';
import type { ModelJSON, YjsModelJson, SharedSheet, TypedMap } from './types/yjs';
import type { WorksheetType, ModelCellType, DrawingElement, AutoFilterItem } from './types/model';
import type { ResultType } from './types/parser';
import type { IRange } from './types/range';
import {
  bindFormulaReferences,
  renderFormulaReferences,
  type BoundFormula,
} from './formula/bindings';

export const PROTOCOL_VERSION = 3;
export const SHARED_KEYS = [
  'workbook',
  'worksheets',
  'mergeCells',
  'customHeight',
  'customWidth',
  'definedNames',
  'drawings',
  'autoFilter',
] as const;
export type SharedKey = (typeof SHARED_KEYS)[number];
const CELL_PREFIX = 'excel:cell:';
const ANCHOR_KEY = 'excel:anchors';
const FORMULA_KEY = 'excel:formulaBindings';

type AxisAnchor = {
  start: Uint8Array;
  end: Uint8Array;
  first: string;
  last: string;
  single: boolean;
  full: boolean;
};
export type AnchoredRange = { sheetId: string; rows: AxisAnchor; cols: AxisAnchor };
type CellContent = {
  revision: string;
  value: ResultType;
  formula?: string;
  binding?: BoundFormula<AnchoredRange>;
};
type ComputedValue = { revision: string; value: ResultType };
type StoredCellValue = ModelCellType[keyof ModelCellType] | CellContent | ComputedValue;
export type SharedType = AbstractType<any>;
export interface CellMap {
  get<K extends keyof ModelCellType>(key: K): ModelCellType[K] | undefined;
  set<K extends keyof ModelCellType>(key: K, value: ModelCellType[K]): ModelCellType[K];
  clear(): void;
  toJSON(): ModelCellType;
}
function isContent(value: StoredCellValue): value is CellContent {
  return !!value && typeof value === 'object' && 'revision' in value && 'value' in value;
}
function literalValue(value: unknown): ResultType {
  return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
    ? value
    : '';
}

function splitCellKey(key: string) {
  const parts = key.split('_');
  const colId = parts.pop()!;
  const rowId = parts.pop()!;
  return { sheetId: parts.join('_'), rowId, colId };
}

export function sharedTypeName(key: SharedKey) {
  return `excel:${key}`;
}

export function mergeCellKey(range: IRange) {
  return JSON.stringify([range.sheetId, range.row, range.col, range.rowCount, range.colCount]);
}

export function createSharedSheet(sheet: WorksheetType): TypedMap<SharedSheet> {
  const result = new YMap(Object.entries(sheet)) as TypedMap<SharedSheet>;
  const rows = new YArray<string>();
  const cols = new YArray<string>();
  rows.insert(
    0,
    Array.from({ length: sheet.rowCount }, (_, i) => String(i)),
  );
  cols.insert(
    0,
    Array.from({ length: sheet.colCount }, (_, i) => String(i)),
  );
  result.set('rows', rows);
  result.set('cols', cols);
  return result;
}

export function readSheet(sheet: TypedMap<SharedSheet>): WorksheetType {
  const tabColor = sheet.get('tabColor');
  return {
    sheetId: sheet.get('sheetId')!,
    name: sheet.get('name')!,
    sort: sheet.get('sort')!,
    isHide: sheet.get('isHide')!,
    rowCount: sheet.get('rows')!.length,
    colCount: sheet.get('cols')!.length,
    ...(tabColor === undefined ? {} : { tabColor }),
  };
}

export class SharedRoot {
  private typeListener?: (type: SharedType) => void;
  private cellFacades = new Map<string, CellMap>();
  constructor(readonly doc: Doc) {
    const meta = doc.getMap('excel:meta');
    const version = meta.get('version');
    if (version === 2) upgradeDocument(doc);
    else if (version !== undefined && version !== PROTOCOL_VERSION) {
      throw new Error(`Unsupported collaboration protocol: ${version}`);
    }
    if (doc.getMap('excel').size) {
      throw new Error('Legacy Yjs documents must be migrated through JSON before collaboration');
    }
    if (version === undefined) meta.set('version', PROTOCOL_VERSION);
  }

  get<K extends SharedKey>(key: K): YjsModelJson[K] {
    return this.doc.getMap(sharedTypeName(key)) as YjsModelJson[K];
  }

  get types() {
    const types: SharedType[] = SHARED_KEYS.map((key) => this.doc.getMap(sharedTypeName(key)));
    types.push(this.anchors, this.formulas);
    for (const [name] of this.doc.share) {
      if (name.startsWith(CELL_PREFIX)) types.push(this.doc.getMap(name));
    }
    return types;
  }

  onType(listener?: (type: SharedType) => void) {
    this.typeListener = listener;
  }
  get anchors() {
    return this.doc.getMap<AnchoredRange | string>(ANCHOR_KEY);
  }
  get formulas() {
    return this.doc.getMap<BoundFormula<AnchoredRange>>(FORMULA_KEY);
  }
  cell(key: string, create = false): CellMap | undefined {
    const exists = this.get('worksheets').has(key);
    if (!exists && !create) return undefined;
    const cell = this.doc.getMap<StoredCellValue>(`${CELL_PREFIX}${key}`);
    this.typeListener?.(cell);
    if (!create && !Array.from(cell.keys()).some((field) => field !== 'computed')) return undefined;
    if (!exists && create) {
      this.get('worksheets').set(key, true);
    }
    let facade = this.cellFacades.get(key);
    if (!facade) {
      facade = {
        get: <K extends keyof ModelCellType>(field: K) => this.readCell(key, cell, false)[field],
        set: <K extends keyof ModelCellType>(field: K, value: ModelCellType[K]) => {
          if (field === 'value' || field === 'formula') {
            const previous = this.readCell(key, cell, false);
            const next = { ...previous, [field]: value };
            if (field === 'value') next.formula = previous.formula === undefined ? undefined : '';
            cell.set('content', this.makeContent(key, next));
          } else cell.set(field, value);
          return value;
        },
        clear: () => cell.clear(),
        toJSON: () => this.readCell(key, cell),
      };
      this.cellFacades.set(key, facade);
    }
    return facade;
  }
  *cells() {
    for (const key of this.get('worksheets').keys()) {
      const cell = this.cell(key);
      if (cell) yield [key, cell] as const;
    }
  }
  deleteCell(key: string) {
    this.cell(key)?.clear();
  }
  cellCoordinate(key: string) {
    const { sheetId, rowId, colId } = splitCellKey(key);
    const sheet = this.get('workbook').get(sheetId);
    if (!sheet) return undefined;
    const row = sheet.get('rows')!.toArray().indexOf(rowId);
    const col = sheet.get('cols')!.toArray().indexOf(colId);
    return row < 0 || col < 0 ? undefined : { sheetId, row, col };
  }
  cellJSON(key: string): ModelCellType | undefined {
    const cell = this.cell(key);
    if (!cell) return undefined;
    return cell.toJSON();
  }
  private readCell(key: string, cell: YMap<StoredCellValue>, render = true): ModelCellType {
    const { content: rawContent, computed: rawComputed, ...styles } = cell.toJSON();
    const content = isContent(rawContent) ? rawContent : undefined;
    const computed = isContent(rawComputed) ? rawComputed : undefined;
    const result = {
      ...styles,
      value:
        computed && content && computed.revision === content.revision
          ? computed.value
          : (content?.value ?? ''),
      ...(content?.formula === undefined ? {} : { formula: content.formula }),
    };
    const binding = content?.binding;
    const coordinate = render && binding ? this.cellCoordinate(key) : undefined;
    if (binding && coordinate && binding.source === result.formula) {
      result.formula = renderFormulaReferences(binding, {
        ...coordinate,
        resolveRange: (anchor) => this.resolveRange(anchor),
        getSheetName: (id) => this.getSheets().find((sheet) => sheet.sheetId === id)?.name,
      });
    }
    return result;
  }
  private makeContent(key: string, data: Pick<ModelCellType, 'value' | 'formula'>): CellContent {
    const result: CellContent = {
      revision: v4(),
      value: data.value ?? '',
      ...(data.formula === undefined ? {} : { formula: data.formula }),
    };
    if (!data.formula) return result;
    const coordinate = this.cellCoordinate(key);
    if (!coordinate) return result;
    result.binding = bindFormulaReferences(data.formula, {
      ...coordinate,
      resolveSheet: (name) =>
        this.getSheets().find((sheet) => sheet.name.toLowerCase() === name.toLowerCase())?.sheetId,
      isDefinedName: (name) =>
        Array.from(this.get('definedNames').keys()).some(
          (key) => key.toLowerCase() === name.toLowerCase(),
        ),
      bindRange: (range) => this.anchorRange(range),
    });
    return result;
  }
  bindFormula(key: string, formula: string, force = false) {
    const cell = this.cell(key);
    if (!cell) return;
    const raw = this.doc.getMap<StoredCellValue>(`${CELL_PREFIX}${key}`);
    const value = raw.get('content');
    const content = isContent(value) ? value : undefined;
    if (!force && content?.formula === formula && (!formula || content.binding?.source === formula))
      return;
    const next = this.makeContent(key, { value: cell.get('value') ?? '', formula });
    if (content) next.revision = content.revision;
    raw.set('content', next);
  }
  replaceCell(key: string, data: ModelCellType) {
    this.cell(key, true);
    const raw = this.doc.getMap<StoredCellValue>(`${CELL_PREFIX}${key}`);
    raw.clear();
    const { value, formula, ...styles } = data;
    for (const [field, fieldValue] of Object.entries(styles)) raw.set(field, fieldValue);
    raw.set(
      'content',
      this.makeContent(key, { value: value ?? '', ...(formula === undefined ? {} : { formula }) }),
    );
  }
  setComputedValue(key: string, value: ResultType) {
    const raw = this.doc.getMap<StoredCellValue>(`${CELL_PREFIX}${key}`);
    const valueBefore = raw.get('content');
    const content = isContent(valueBefore) ? valueBefore : undefined;
    if (content?.formula) raw.set('computed', { revision: content.revision, value });
  }
  anchorRange(range: IRange): AnchoredRange | undefined {
    const sheet = this.get('workbook').get(range.sheetId);
    if (!sheet) return undefined;
    const anchor = (
      axis: 'rows' | 'cols',
      start: number,
      count: number,
    ): AxisAnchor | undefined => {
      const order = sheet.get(axis)!;
      const full = count === 0;
      if (full) start = 0;
      const end = full ? order.length : start + count;
      if (
        !Number.isInteger(start) ||
        !Number.isInteger(end) ||
        start < 0 ||
        end <= start ||
        end > order.length
      )
        return undefined;
      return {
        start: encodeRelativePosition(createRelativePositionFromTypeIndex(order, start, 0)),
        end: encodeRelativePosition(createRelativePositionFromTypeIndex(order, end, -1)),
        first: order.get(start),
        last: order.get(end - 1),
        single: !full && count === 1,
        full,
      };
    };
    const rows = anchor('rows', range.row, range.rowCount);
    const cols = anchor('cols', range.col, range.colCount);
    return rows && cols ? { sheetId: range.sheetId, rows, cols } : undefined;
  }
  resolveRange(anchor: AnchoredRange): IRange | undefined {
    const sheet = this.get('workbook').get(anchor.sheetId);
    if (!sheet) return undefined;
    const resolve = (axis: 'rows' | 'cols', data: AxisAnchor) => {
      const order = sheet.get(axis)!;
      if (data.full) return { start: 0, count: 0 };
      const list = order.toArray();
      if (data.single) {
        const index = list.indexOf(data.first);
        return index < 0 ? undefined : { start: index, count: 1 };
      }
      const first = list.indexOf(data.first);
      const last = list.indexOf(data.last);
      const start =
        first >= 0
          ? first
          : createAbsolutePositionFromRelativePosition(decodeRelativePosition(data.start), this.doc)
              ?.index;
      const end =
        last >= 0
          ? last + 1
          : createAbsolutePositionFromRelativePosition(decodeRelativePosition(data.end), this.doc)
              ?.index;
      return start === undefined || end === undefined || end <= start
        ? undefined
        : { start: Math.min(start, order.length), count: Math.min(end, order.length) - start };
    };
    const rows = resolve('rows', anchor.rows);
    const cols = resolve('cols', anchor.cols);
    return rows && cols
      ? {
          sheetId: anchor.sheetId,
          row: rows.start,
          col: cols.start,
          rowCount: rows.count,
          colCount: cols.count,
        }
      : undefined;
  }
  bindRange(key: string, range: IRange) {
    const anchor = this.anchorRange(range);
    if (anchor) this.anchors.set(key, anchor);
    else this.anchors.delete(key);
  }
  range(key: string, fallback: IRange): IRange | undefined {
    const anchor = this.anchors.get(key);
    return anchor && typeof anchor !== 'string' ? this.resolveRange(anchor) : fallback;
  }
  bindMetadata() {
    for (const [key, range] of this.get('mergeCells')) this.bindRange(`merge:${key}`, range);
    for (const [key, range] of this.get('definedNames')) this.bindRange(`name:${key}`, range);
    for (const [key, item] of this.get('autoFilter')) {
      const range = item.get('range');
      if (range) this.bindRange(`filter:${key}`, range);
      const col = item.get('col');
      if (col !== undefined) this.bindFilterColumn(key, col);
      const filters = item.get('filters');
      if (filters && !(filters instanceof YMap)) {
        const shared = new YMap<NonNullable<AutoFilterItem['value']>>();
        for (const [column, criterion] of Object.entries(filters)) {
          const columnId = this.get('workbook').get(key)?.get('cols')?.get(Number(column));
          if (columnId !== undefined) shared.set(columnId, criterion);
        }
        item.set('filters', shared as unknown as NonNullable<AutoFilterItem['filters']>);
      }
    }
    for (const [key, item] of this.get('drawings')) this.bindDrawing(key, item.toJSON());
    for (const [key, cell] of this.cells()) {
      const formula = cell.get('formula');
      if (formula) this.bindFormula(key, formula, true);
    }
  }
  bindFilterColumn(sheetId: string, col: number) {
    const id = this.get('workbook').get(sheetId)?.get('cols')?.get(col);
    if (id !== undefined) this.anchors.set(`filterColumn:${sheetId}`, id);
  }
  bindFilterColumns(sheetId: string, filters: NonNullable<AutoFilterItem['filters']>) {
    for (const col of Object.keys(filters)) {
      const id = this.get('workbook').get(sheetId)?.get('cols')?.get(Number(col));
      if (id !== undefined) this.anchors.set(`filterColumn:${sheetId}:${col}`, id);
    }
  }
  filter(sheetId: string): AutoFilterItem | undefined {
    const stored = this.get('autoFilter').get(sheetId);
    const item = stored?.toJSON();
    if (!item) return undefined;
    const range = this.range(`filter:${sheetId}`, item.range);
    if (!range) return undefined;
    const colId = this.anchors.get(`filterColumn:${sheetId}`);
    const col =
      typeof colId === 'string'
        ? this.get('workbook').get(sheetId)?.get('cols')?.toArray().indexOf(colId)
        : item.col;
    return {
      ...item,
      range,
      ...(item.filters
        ? {
            filters: Object.fromEntries(
              Object.entries(item.filters).flatMap(([column, criterion]) => {
                const columnId = this.anchors.get(`filterColumn:${sheetId}:${column}`);
                const index =
                  stored?.get('filters') instanceof YMap
                    ? this.get('workbook').get(sheetId)?.get('cols')?.toArray().indexOf(column)
                    : typeof columnId === 'string'
                      ? this.get('workbook').get(sheetId)?.get('cols')?.toArray().indexOf(columnId)
                      : Number(column);
                return index === undefined || index < 0 ? [] : [[String(index), criterion]];
              }),
            ),
          }
        : {}),
      ...(typeof col === 'number' && col < 0
        ? { col: undefined, value: undefined }
        : col === undefined
          ? {}
          : { col }),
    };
  }
  bindDrawing(key: string, item: DrawingElement) {
    this.bindRange(`drawing:${key}`, {
      sheetId: item.sheetId,
      row: item.fromRow,
      col: item.fromCol,
      rowCount: 1,
      colCount: 1,
    });
    if (item.chartRange) this.bindRange(`chart:${key}`, item.chartRange);
  }
  drawing(key: string): DrawingElement | undefined {
    const item = this.get('drawings').get(key)?.toJSON();
    if (!item || !this.get('workbook').has(item.sheetId)) return undefined;
    const range = this.range(`drawing:${key}`, {
      sheetId: item.sheetId,
      row: item.fromRow,
      col: item.fromCol,
      rowCount: 1,
      colCount: 1,
    });
    const chartRange = item.chartRange && this.range(`chart:${key}`, item.chartRange);
    return {
      ...item,
      fromRow:
        range?.row ??
        Math.min(item.fromRow, this.get('workbook').get(item.sheetId)!.get('rows')!.length - 1),
      fromCol:
        range?.col ??
        Math.min(item.fromCol, this.get('workbook').get(item.sheetId)!.get('cols')!.length - 1),
      ...(item.chartRange
        ? { chartRange: chartRange ?? { ...item.chartRange, row: -1, col: -1 } }
        : {}),
    };
  }
  getSheets(): WorksheetType[] {
    const sheets = Array.from(this.get('workbook').values()).map(readSheet);
    sheets.sort((a, b) => a.sort - b.sort || (a.sheetId < b.sheetId ? -1 : 1));
    const reserved = new Set(sheets.map((sheet) => sheet.name.toLowerCase()));
    const used = new Set<string>();
    for (const sheet of sheets) {
      const original = sheet.name;
      let suffix = 2;
      while (used.has(sheet.name.toLowerCase())) {
        const ending = ` (${suffix++})`;
        const candidate = `${original.slice(0, 31 - ending.length)}${ending}`;
        if (!reserved.has(candidate.toLowerCase())) sheet.name = candidate;
      }
      used.add(sheet.name.toLowerCase());
    }
    return sheets;
  }

  sizeKey(sheetId: string, axis: 'rows' | 'cols', index: number) {
    if (!Number.isInteger(index) || index < 0) return undefined;
    const order = this.get('workbook').get(sheetId)?.get(axis);
    if (order && Number.isInteger(index) && index >= order.length) {
      return `${sheetId}_overflow:${index}`;
    }
    const id = order?.get(index);
    return id === undefined ? undefined : `${sheetId}_${id}`;
  }

  toJSON(): ModelJSON {
    const workbook: ModelJSON['workbook'] = {};
    const indices = new Map<string, { rows: Map<string, number>; cols: Map<string, number> }>();
    for (const info of this.getSheets()) {
      const id = info.sheetId;
      const sheet = this.get('workbook').get(id)!;
      workbook[id] = info;
      indices.set(id, {
        rows: new Map(
          sheet
            .get('rows')!
            .toArray()
            .map((value, index) => [value, index]),
        ),
        cols: new Map(
          sheet
            .get('cols')!
            .toArray()
            .map((value, index) => [value, index]),
        ),
      });
    }
    const worksheets: ModelJSON['worksheets'] = {};
    for (const key of this.get('worksheets').keys()) {
      const parts = key.split('_');
      const colId = parts.pop()!;
      const rowId = parts.pop()!;
      const sheetId = parts.join('_');
      const index = indices.get(sheetId);
      const row = index?.rows.get(rowId);
      const col = index?.cols.get(colId);
      if (row !== undefined && col !== undefined) {
        const value = this.cellJSON(key);
        if (value) worksheets[`${sheetId}_${row}_${col}`] = value;
      }
    }
    const sizes = (key: 'customHeight' | 'customWidth', axis: 'rows' | 'cols') => {
      const result: ModelJSON['customHeight'] = {};
      for (const [keyId, value] of this.get(key)) {
        const separator = keyId.lastIndexOf('_');
        const sheetId = keyId.slice(0, separator);
        const id = keyId.slice(separator + 1);
        if (!indices.has(sheetId)) continue;
        const index = id.startsWith('overflow:')
          ? Number(id.slice('overflow:'.length))
          : indices.get(sheetId)?.[axis].get(id);
        if (index !== undefined) {
          const target = `${sheetId}_${index}`;
          if (!id.startsWith('overflow:') || result[target] === undefined) result[target] = value;
        }
      }
      return result;
    };
    return {
      workbook,
      worksheets,
      currentSheetId: '',
      rangeMap: {},
      scroll: {},
      mergeCells: Object.fromEntries(
        Array.from(this.get('mergeCells').entries())
          .map(([key, range]) => this.range(`merge:${key}`, range))
          .filter((range): range is IRange => !!range && indices.has(range.sheetId))
          .map((range) => [mergeCellKey(range), range]),
      ),
      customHeight: sizes('customHeight', 'rows'),
      customWidth: sizes('customWidth', 'cols'),
      definedNames: Object.fromEntries(
        Array.from(this.get('definedNames')).map(([key, value]) => [
          key,
          this.range(`name:${key}`, value) ?? {
            ...value,
            row: -1,
            col: -1,
            rowCount: 1,
            colCount: 1,
          },
        ]),
      ),
      drawings: Object.fromEntries(
        Array.from(this.get('drawings').keys())
          .map((key) => [key, this.drawing(key)])
          .filter(([, value]) => value),
      ),
      autoFilter: Object.fromEntries(
        Array.from(this.get('autoFilter').keys())
          .map((key) => [key, this.filter(key)])
          .filter(([, value]) => value),
      ),
    };
  }
}

export function hydrateDocument(doc: Doc, json: ModelJSON) {
  for (const sheet of Object.values(json.workbook ?? {})) {
    if (
      !Number.isInteger(sheet.rowCount) ||
      !Number.isInteger(sheet.colCount) ||
      sheet.rowCount <= 0 ||
      sheet.rowCount > 1048576 ||
      sheet.colCount <= 0 ||
      sheet.colCount > 16384
    ) {
      throw new Error('Invalid worksheet dimensions in stored document');
    }
  }
  const sheets = new Set(Object.values(json.workbook ?? {}).map((sheet) => sheet.sheetId));
  for (const key of ['customHeight', 'customWidth'] as const) {
    for (const id of Object.keys(json[key] ?? {})) {
      const separator = id.lastIndexOf('_');
      const sheetId = id.slice(0, separator);
      const coordinate = id.slice(separator + 1);
      if (
        !sheets.has(sheetId) ||
        !/^\d+$/.test(coordinate) ||
        !Number.isInteger(Number(coordinate)) ||
        Number(coordinate) < 0
      ) {
        throw new Error('Invalid custom size coordinate in stored document');
      }
    }
  }
  const root = new SharedRoot(doc);
  doc.transact(() => {
    for (const key of root.get('worksheets').keys()) root.deleteCell(key);
    for (const key of SHARED_KEYS) root.get(key).clear();
    root.anchors.clear();
    root.formulas.clear();
    for (const sheet of Object.values(json.workbook ?? {})) {
      root.get('workbook').set(sheet.sheetId, createSharedSheet(sheet));
    }
    for (const [key, value] of Object.entries(json.worksheets ?? {})) {
      root.replaceCell(key, value);
    }
    for (const [id, value] of Object.entries(json.drawings ?? {})) {
      root.get('drawings').set(id, new YMap(Object.entries(value)) as TypedMap<DrawingElement>);
    }
    for (const [id, value] of Object.entries(json.autoFilter ?? {})) {
      root.get('autoFilter').set(id, new YMap(Object.entries(value)) as TypedMap<AutoFilterItem>);
    }
    for (const key of ['customHeight', 'customWidth'] as const) {
      for (const [id, value] of Object.entries(json[key] ?? {})) {
        const separator = id.lastIndexOf('_');
        const sheetId = id.slice(0, separator);
        const coordinate = id.slice(separator + 1);
        const target = root.sizeKey(
          sheetId,
          key === 'customHeight' ? 'rows' : 'cols',
          Number(coordinate),
        );
        if (target === undefined)
          throw new Error('Invalid custom size coordinate in stored document');
        root.get(key).set(target, value);
      }
    }
    for (const value of Object.values(json.mergeCells ?? {})) {
      root.get('mergeCells').set(mergeCellKey(value), value);
    }
    for (const [id, value] of Object.entries(json.definedNames ?? {})) {
      root.get('definedNames').set(id, value);
    }
    root.bindMetadata();
  }, 'initialization');
}

export function upgradeDocument(doc: Doc): { fromVersion: 2 | 3; version: 3 } {
  const meta = doc.getMap('excel:meta');
  const version = meta.get('version');
  if (version === undefined || version === PROTOCOL_VERSION) return { fromVersion: 3, version: 3 };
  if (version !== 2) throw new Error(`Unsupported collaboration protocol: ${version}`);
  if (doc.getMap('excel').size) throw new Error('Unsupported legacy collaboration root');
  const workbook = doc.getMap<TypedMap<SharedSheet>>('excel:workbook');
  for (const [id, sheet] of workbook) {
    if (
      !(sheet instanceof YMap) ||
      !(sheet.get('rows') instanceof YArray) ||
      !(sheet.get('cols') instanceof YArray) ||
      sheet.get('sheetId') !== id ||
      !sheet.get('rows')!.length ||
      !sheet.get('cols')!.length ||
      typeof sheet.get('name') !== 'string' ||
      sheet.get('rows')!.length > 1048576 ||
      sheet.get('cols')!.length > 16384
    ) {
      throw new Error('Invalid worksheet in collaboration protocol v2 document');
    }
    for (const axis of ['rows', 'cols'] as const) {
      const ids = sheet.get(axis)!.toArray();
      if (ids.some((value) => typeof value !== 'string') || new Set(ids).size !== ids.length) {
        throw new Error('Invalid worksheet identities in collaboration protocol v2 document');
      }
    }
  }
  const legacyCells = doc.getMap<YMap<unknown>>('excel:worksheets');
  for (const [key, cell] of legacyCells) {
    if (!(cell instanceof YMap) || !workbook.has(splitCellKey(key).sheetId)) {
      throw new Error('Invalid cell in collaboration protocol v2 document');
    }
  }
  const validRange = (value: unknown): value is IRange =>
    !!value &&
    typeof value === 'object' &&
    'sheetId' in value &&
    typeof value.sheetId === 'string' &&
    workbook.has(value.sheetId) &&
    'row' in value &&
    Number.isInteger(value.row) &&
    'col' in value &&
    Number.isInteger(value.col) &&
    'rowCount' in value &&
    Number.isInteger(value.rowCount) &&
    'colCount' in value &&
    Number.isInteger(value.colCount);
  for (const key of ['mergeCells', 'definedNames'] as const) {
    for (const range of doc.getMap(sharedTypeName(key)).values()) {
      if (!validRange(range))
        throw new Error(`Invalid ${key} in collaboration protocol v2 document`);
    }
  }
  for (const item of doc.getMap('excel:autoFilter').values()) {
    if (!(item instanceof YMap) || !validRange(item.get('range'))) {
      throw new Error('Invalid autoFilter in collaboration protocol v2 document');
    }
  }
  for (const item of doc.getMap('excel:drawings').values()) {
    if (
      !(item instanceof YMap) ||
      typeof item.get('sheetId') !== 'string' ||
      !workbook.has(item.get('sheetId')) ||
      (item.get('chartRange') !== undefined && !validRange(item.get('chartRange')))
    ) {
      throw new Error('Invalid drawing in collaboration protocol v2 document');
    }
  }
  doc.transact(() => {
    meta.set('version', PROTOCOL_VERSION);
    const root = new SharedRoot(doc);
    for (const [key, cell] of Array.from(legacyCells.entries())) {
      const { value, formula, ...styles } = cell.toJSON();
      const data: ModelCellType = {
        ...styles,
        value: literalValue(value),
        ...(typeof formula === 'string' ? { formula } : {}),
      };
      doc.getMap<boolean>('excel:worksheets').set(key, true);
      root.replaceCell(key, data);
    }
    root.bindMetadata();
  }, 'protocol-migration');
  return { fromVersion: 2, version: 3 };
}

export function initializeEmptyDocument(doc: Doc) {
  const root = new SharedRoot(doc);
  if (root.get('workbook').size) return;
  const sheet: WorksheetType = {
    sheetId: v4(),
    name: 'Sheet1',
    sort: 1,
    isHide: false,
    rowCount: 200,
    colCount: 30,
  };
  root.get('workbook').set(sheet.sheetId, createSharedSheet(sheet));
}
