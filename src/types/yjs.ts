import * as Y from 'yjs';
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

/**
 * TypedDoc is intended to create a typed version of Yjs Doc.
 *
 * Example:
 *
 * type Bar = {
 *     "prop1": string;
 *     "prop2": Y.Text;
 * }
 *
 * const doc = new Y.Doc() as TypedDoc<{ "map1": TypedMap<Bar> }, { "array1": TypedArray<Bar> }>;
 *
 * doc.getMap("map1") // type is TypedMap<Bar>
 * doc.getArray("array1") // type is TypedArray<Bar>
 */
// @ts-ignore
export interface TypedDoc<
  Maps extends Record<string, TypedMap<any>> = Record<string, TypedMap<any>>,
  Arrays extends Record<string, TypedArray<any>> = Record<
    string,
    TypedArray<any>
  >,
> extends Y.Doc {
  /**
   * I could not write a working type for a get method, this is incomplete implementation:
   * get<SharedTypes extends Maps & Arrays & Texts & XmlFragments, Name extends StringKeyOf<SharedTypes>>(name: Name, TypeConstructor?: Function): SharedTypes[Name];
   * */
  get(name: string, TypeConstructor?: Function): Y.AbstractType<unknown>;

  getMap<Name extends StringKeyOf<Maps>>(name: Name): Maps[Name];

  getArray<Name extends StringKeyOf<Arrays>>(name: Name): Arrays[Name];
}

/**
 * TypedMap is a heavily typed version of Yjs Map.
 * Often in Yjs Map also replaces the plain object, so the src are more complicated than ES2015 Map.
 *
 * Note: to create one from existing Map you have to cast the type of it with the "as" keyword.
 *
 * Default Yjs typing can be defined like this:
 *
 * type Bar = {
 *     "prop1": string;
 *     "prop2": Y.Text;
 * }
 *
 * const m = new Y.Map() as TypedMap<{ [key: string]: Bar }>;
 *
 * m.get("someString") // type is Bar | undefined
 *
 * Object like typing example:
 *
 * const m = new Y.Map() as TypedMap<Bar>;
 *
 * m.get("prop2") // type is Y.Text | undefined
 * m.get("unknownProp") // TS reports error on "unknownProp", type is string | Y.Text | undefined
 */
// @ts-ignore
export interface TypedMap<Data extends Record<string, any>> extends Y.Map<any> {
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

/**
 * TypedArray is a typed version of Yjs Array. The only improvement so far is return type of the get method.
 *
 * Example:
 *
 * type Bar = {
 *     "prop1": string;
 *     "prop2": Y.Text;
 * }
 *
 * const a = new Y.Array() as TypedArray<Bar>;
 *
 * a.get(0); // type is string | Y.Text | undefined
 */
export interface TypedArray<T> extends Y.Array<any> {
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

export type HistoryItem = {
  id: number;
  doc_id: string;
  update: string;
  create_time: string;
  other: string;
};

export interface CollaborationProvider {
  addHistory(update: Uint8Array): void;
  retrieveHistory(): Promise<Uint8Array[]>;
  subscribe(): void;
}
