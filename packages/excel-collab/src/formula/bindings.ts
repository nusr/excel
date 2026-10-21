import type { IRange } from '../types';
import { ERROR_SET, XLSX_MAX_COL_COUNT, XLSX_MAX_ROW_COUNT } from '../util/constant';
import { intToColumnName } from '../util/convert';
import { mergeRange, parseR1C1, parseReference } from '../util/reference';

export interface FormulaReferenceEndpoint {
  start: number;
  end: number;
  kind: 'a1' | 'r1c1';
  absoluteRow: boolean;
  absoluteCol: boolean;
  rowEnd: boolean;
  colEnd: boolean;
}

export interface FormulaSheetQualifier {
  start: number;
  end: number;
  sheetId: string;
  name: string;
}

export interface BoundFormulaReference<A> {
  range: IRange;
  anchor: A;
  start: number;
  end: number;
  endpoints: FormulaReferenceEndpoint[];
  qualifiers: FormulaSheetQualifier[];
}

export interface BoundFormula<A> {
  source: string;
  references: BoundFormulaReference<A>[];
  qualifiers?: FormulaSheetQualifier[];
}

export interface BindFormulaOptions<A> {
  sheetId: string;
  row: number;
  col: number;
  resolveSheet: (name: string) => string | undefined;
  isDefinedName?: (name: string, sheetId: string) => boolean;
  bindRange: (range: IRange) => A | undefined;
}

export interface RenderFormulaOptions<A> {
  row: number;
  col: number;
  resolveRange: (anchor: A) => IRange | undefined;
  getSheetName?: (sheetId: string) => string | undefined;
}

interface Qualifier {
  name: string;
  start: number;
  end: number;
  after: number;
}

interface Atom {
  start: number;
  end: number;
  range: IRange;
  sheetId: string | undefined;
  named: boolean;
  qualifier?: FormulaSheetQualifier;
  endpoint: FormulaReferenceEndpoint;
}

const identifierCharacter = /[\p{L}\p{N}_.$\\?[\]]/u;
const identifier = /^[\p{L}\p{N}_.$\\?]+/u;
const r1c1 = /^(R)(\[-?\d+\]|\d+)?(C)(\[-?\d+\]|\d+)?/i;
const a1 = /^(?:\$?[A-Za-z]{1,3}\$?[1-9]\d*|\$?[A-Za-z]{1,3}|\$?[1-9]\d*)/;

function qualifierAt(source: string, start: number): Qualifier | undefined {
  if (source[start] === "'") {
    let name = '';
    for (let end = start + 1; end < source.length; end++) {
      if (source[end] !== "'") {
        name += source[end];
      } else if (source[end + 1] === "'") {
        name += "'";
        end++;
      } else {
        return source[end + 1] === '!'
          ? { name, start, end: end + 1, after: end + 2 } : undefined;
      }
    }
    return undefined;
  }
  const match = identifier.exec(source.slice(start));
  if (!match || source[start + match[0].length] !== '!') return undefined;
  const end = start + match[0].length;
  return { name: match[0], start, end, after: end + 1 };
}

function quotedEnd(source: string, start: number, quote: string) {
  let end = start + 1;
  while (end < source.length) {
    if (source[end++] === quote) {
      if (source[end] === quote) end++;
      else return end;
    }
  }
  return source.length;
}

function atomAt<A>(
  source: string,
  start: number,
  inheritedSheet: string | undefined,
  options: BindFormulaOptions<A>,
): Atom | undefined {
  const qualifier = qualifierAt(source, start);
  const atomStart = qualifier?.after ?? start;
  const text = source.slice(atomStart);
  const relative = r1c1.exec(text);
  const match = relative ?? a1.exec(text);
  if (!match) return undefined;
  const raw = match[0];
  const end = atomStart + raw.length;
  if (identifierCharacter.test(source[end] ?? '') || /^\s*\(/.test(source.slice(end))) {
    return undefined;
  }
  const range = relative ? parseR1C1(raw, options) : parseReference(raw);
  if (!range) return undefined;
  const sheetId = qualifier ? options.resolveSheet(qualifier.name) : inheritedSheet;
  const cell = /^(\$?)[A-Za-z]+(\$?)\d+$/.exec(raw);
  const endpoint: FormulaReferenceEndpoint = {
    start: atomStart,
    end,
    kind: relative ? 'r1c1' : 'a1',
    absoluteRow: relative ? Boolean(relative[2] && !relative[2].startsWith('['))
      : cell ? Boolean(cell[2]) : range.colCount === 0 && raw.startsWith('$'),
    absoluteCol: relative ? Boolean(relative[4] && !relative[4].startsWith('['))
      : cell ? Boolean(cell[1]) : range.rowCount === 0 && raw.startsWith('$'),
    rowEnd: false,
    colEnd: false,
  };
  return {
    start,
    end,
    range: { ...range.toIRange(), sheetId: sheetId ?? '' },
    sheetId,
    named: Boolean(options.isDefinedName?.(raw, sheetId ?? options.sheetId)),
    qualifier: qualifier && sheetId !== undefined
      ? { start: qualifier.start, end: qualifier.end, name: qualifier.name, sheetId } : undefined,
    endpoint,
  };
}

/**
 * Capture literal references only. Named ranges remain textual and resolve through
 * their own metadata; strings (including INDIRECT arguments) are never interpreted.
 */
export function bindFormulaReferences<A>(
  formula: string,
  options: BindFormulaOptions<A>,
): BoundFormula<A> {
  const references: BoundFormulaReference<A>[] = [];
  const qualifiers = new Map<number, FormulaSheetQualifier>();
  let cursor = 0;
  while (cursor < formula.length) {
    const char = formula[cursor];
    if (char === '"') {
      cursor = quotedEnd(formula, cursor, char);
      continue;
    }
    if (char === '#') {
      const error = [...ERROR_SET].find((code) => formula.slice(cursor).toUpperCase().startsWith(code));
      cursor += error?.length ?? 1;
      continue;
    }
    if (char === '[') {
      let depth = 1;
      while (++cursor < formula.length && depth) {
        if (formula[cursor] === '[') depth++;
        else if (formula[cursor] === ']') depth--;
      }
      continue;
    }
    if (identifierCharacter.test(formula[cursor - 1] ?? '') || formula[cursor - 1] === '!') {
      cursor++;
      continue;
    }
    const qualifier = qualifierAt(formula, cursor);
    if (qualifier) {
      const sheetId = options.resolveSheet(qualifier.name);
      if (sheetId !== undefined) qualifiers.set(qualifier.start, {
        start: qualifier.start, end: qualifier.end, name: qualifier.name, sheetId,
      });
    } else if (char === "'") {
      cursor = quotedEnd(formula, cursor, char);
      continue;
    }
    const first = atomAt(formula, cursor, options.sheetId, options);
    if (!first) {
      cursor = qualifier?.after ?? cursor + (identifier.exec(formula.slice(cursor))?.[0].length ?? 1);
      continue;
    }
    const colon = /^\s*:\s*/.exec(formula.slice(first.end));
    const second = colon ? atomAt(formula, first.end + colon[0].length, first.sheetId, options) : undefined;
    const merged = second && !first.named && !second.named && first.sheetId === second.sheetId
      ? mergeRange(first.range, second.range) : undefined;
    const atoms = merged && second ? [first, second] : [first];
    const range = merged?.toIRange() ?? first.range;
    const end = atoms[atoms.length - 1].end;
    const localQualifiers = atoms.flatMap((atom) => atom.qualifier ? [atom.qualifier] : []);
    for (const item of localQualifiers) qualifiers.set(item.start, item);
    const bareNumber = !colon && !qualifier && /^\d+$/.test(formula.slice(first.endpoint.start, first.end));
    if (!first.named && first.sheetId !== undefined && !bareNumber) {
      const anchor = options.bindRange(range);
      if (anchor !== undefined) {
        references.push({
          range,
          anchor,
          start: first.start,
          end,
          endpoints: atoms.map((atom) => ({
            ...atom.endpoint,
            rowEnd: atoms.length > 1 && range.rowCount > 0 && atom.range.row > range.row,
            colEnd: atoms.length > 1 && range.colCount > 0 && atom.range.col > range.col,
          })),
          qualifiers: localQualifiers,
        });
      }
    }
    cursor = end;
  }
  return { source: formula, references, qualifiers: [...qualifiers.values()] };
}

function validRange(range: IRange): boolean {
  return [range.row, range.col, range.rowCount, range.colCount].every(Number.isSafeInteger) &&
    range.row >= 0 && range.col >= 0 && range.rowCount >= 0 && range.colCount >= 0 &&
    (range.rowCount > 0 || range.colCount > 0) &&
    range.row + Math.max(1, range.rowCount) <= XLSX_MAX_ROW_COUNT &&
    range.col + Math.max(1, range.colCount) <= XLSX_MAX_COL_COUNT;
}

function renderEndpoint<A>(
  raw: string,
  endpoint: FormulaReferenceEndpoint,
  range: IRange,
  options: RenderFormulaOptions<A>,
) {
  const row = range.row + (endpoint.rowEnd ? range.rowCount - 1 : 0);
  const col = range.col + (endpoint.colEnd ? range.colCount - 1 : 0);
  const original = endpoint.kind === 'r1c1' ? parseR1C1(raw, { ...options, sheetId: range.sheetId })
    : parseReference(raw);
  if (original && original.row === row && original.col === col &&
    (original.rowCount === 0) === (range.rowCount === 0) &&
    (original.colCount === 0) === (range.colCount === 0)) return raw;
  if (endpoint.kind === 'r1c1') {
    const syntax = r1c1.exec(raw);
    const axis = (prefix: string, coordinate: number, origin: number, absolute: boolean) =>
      absolute ? `${prefix}${coordinate + 1}`
        : coordinate === origin ? prefix : `${prefix}[${coordinate - origin}]`;
    return axis(syntax?.[1] ?? 'R', row, options.row, endpoint.absoluteRow) +
      axis(syntax?.[3] ?? 'C', col, options.col, endpoint.absoluteCol);
  }
  const column = `${endpoint.absoluteCol ? '$' : ''}${intToColumnName(col)}`;
  const label = `${endpoint.absoluteRow ? '$' : ''}${row + 1}`;
  return range.rowCount === 0 ? column : range.colCount === 0 ? label : column + label;
}

export function renderFormulaReferences<A>(
  binding: BoundFormula<A>,
  options: RenderFormulaOptions<A>,
): string {
  const edits: Array<{ start: number; end: number; value: string }> = [];
  const deleted: Array<{ start: number; end: number }> = [];
  for (const reference of binding.references) {
    const range = options.resolveRange(reference.anchor);
    if (!range || !validRange(range)) {
      deleted.push(reference);
      edits.push({ start: reference.start, end: reference.end, value: '#REF!' });
      continue;
    }
    for (const endpoint of reference.endpoints) {
      const raw = binding.source.slice(endpoint.start, endpoint.end);
      const value = renderEndpoint(raw, endpoint, range, options);
      if (value !== raw) edits.push({ start: endpoint.start, end: endpoint.end, value });
    }
  }
  const qualifiers = binding.qualifiers ?? binding.references.flatMap((reference) => reference.qualifiers);
  for (const qualifier of qualifiers) {
    if (deleted.some((range) => qualifier.start >= range.start && qualifier.end <= range.end)) continue;
    const name = options.getSheetName?.(qualifier.sheetId);
    if (name === undefined || name === qualifier.name) continue;
    const value = /^[A-Za-z_][A-Za-z0-9_]*$/.test(name) ? name : `'${name.replace(/'/g, "''")}'`;
    edits.push({ start: qualifier.start, end: qualifier.end, value });
  }
  let result = binding.source;
  for (const edit of edits.sort((a, b) => b.start - a.start)) {
    result = result.slice(0, edit.start) + edit.value + result.slice(edit.end);
  }
  return result;
}
