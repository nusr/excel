import type { Map, Array } from 'yjs';
import type {
  WorksheetType,
  ModelCellType,
  CustomItem,
  DrawingElement,
  AutoFilterItem,
  ModelScroll,
} from './model';
import type { IRange } from './range';

export type StringKeyOf<T> = Extract<keyof T, string>;

// @ts-ignore
export interface TypedMap<Data extends Record<string, any>> extends Map<any> {
  /**
   * Constructor type is unusable with interface declaration, but this is how I would implement it:
   * new <Key extends StringKeyOf<Data>>(entries?: Iterable<[Key, Data[Key]]>): TypedMap<Data>;
   * */

  clone(): TypedMap<Data>;

  keys<Key extends StringKeyOf<Data>>(): IterableIterator<Key>;

  values<Key extends StringKeyOf<Data>>(): IterableIterator<Data[Key]>;

  entries<Key extends StringKeyOf<Data>>(): IterableIterator<[Key, Data[Key]]>;

  forEach<Key extends StringKeyOf<Data>>(
    f: (arg0: Data[Key], arg1: Key, arg2: TypedMap<Data>) => void,
  ): void;

  delete<Key extends StringKeyOf<Data>>(key: Key): void;

  set<Key extends StringKeyOf<Data>>(key: Key, value: Data[Key]): Data[Key];

  get<Key extends StringKeyOf<Data>>(key: Key): Data[Key] | undefined;

  has<Key extends StringKeyOf<Data>>(key: Key): boolean;

  [Symbol.iterator]<Key extends StringKeyOf<Data>>(): IterableIterator<
    [Key, Data[Key]]
  >;
  toJSON(): Convert<Data>;
}

export interface TypedArray<T> extends Array<any> {
  get(index: number): T | undefined;
}

export type YWorksheet = TypedMap<Record<string, TypedMap<ModelCellType>>>;
export type YWorkbook = TypedMap<Record<string, TypedMap<WorksheetType>>>;
export type YRange = TypedMap<Record<string, IRange>>;
export type YCustomSize = TypedMap<Record<string, CustomItem>>;
export type YDrawings = TypedMap<Record<string, TypedMap<DrawingElement>>>;
export type YAutoFilter = TypedMap<Record<string, TypedMap<AutoFilterItem>>>;
export type YScroll = TypedMap<Record<string, TypedMap<ModelScroll>>>;

export type YjsModelJson = {
  worksheets: YWorksheet; // key: sheetId_row_col
  workbook: YWorkbook; // key: sheetId  workbook.xml_workbook_sheets
  mergeCells: YRange; //key: ref worksheets_*.xml_worksheet_mergeCells
  currentSheetId: string;
  customHeight: YCustomSize; // key: sheetId_row worksheets_*.xml_worksheet_sheetData_customHeight
  customWidth: YCustomSize; // key: sheetId_col  worksheets_*.xml_worksheet_sheetData_customWidth
  definedNames: YRange; // key: defineName workbook.xml_workbook_definedNames
  drawings: YDrawings; // key: uuid, chart floatImage
  rangeMap: YRange; // key: sheetId
  autoFilter: YAutoFilter; // key: sheetId
  scroll: YScroll; // key: sheetId
};

type Convert<T> = T extends Record<string, any>
  ? T extends TypedMap<infer U>
    ? Convert<U>
    : {
        [K in keyof T]: Convert<T[K]>;
      }
  : NonNullable<T>;

export type ModelJSON = Convert<YjsModelJson>;

export type ModelRoot = TypedMap<YjsModelJson>;

export enum ProviderStatus {
  ONLINE = 'Connect',
  LOCAL = 'Local',
  SYNCING = 'Syncing',
}