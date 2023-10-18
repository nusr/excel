import {
  WorkBookJSON,
  WorksheetType,
  ModelCellType,
  StyleType,
  EHorizontalAlign,
  EVerticalAlign,
  EUnderLine,
} from '@/types';
import {
  get,
  parseReference,
  parseCell,
  NUMBER_FORMAT_LIST,
  reactLog,
} from '@/util';

const COMMON_PREFIX = 'xl';
const STYLE_PATH = 'xl/styles.xml';
const WORKBOOK_PATH = 'xl/workbook.xml';
const WORKBOOK_RELATION_PATH = 'xl/_rels/workbook.xml.rels';
const THEME_PATH = 'xl/theme/theme1.xml';
const SHEET_PATH_PREFIX = 'xl/worksheets/';

type ThemeData = Record<
  string,
  {
    'a:srgbClr': { val: string };
    'a:sysClr': { lastClr: string; val: string };
  }
>;
type SheetItem = Pick<WorksheetType, 'name' | 'sheetId'> & {
  'r:id': string;
  state?: string;
};
type RelationItem = {
  Id: string;
  Target: string;
};

type XMLFile = Record<string, any>;
type ColItem = {
  r: string;
  s: string;
  v: {
    '#text': string;
  };
};
type SheetDataRowItem = {
  customHeight: string;
  r: string;
  c: ColItem[];
};

export type XfItem = {
  fontId: string;
  fillId: string;
  numFmtId: string;
  applyFill?: string;
  applyFont?: string;
  applyNumberFormat?: string;
  applyAlignment?: string;
  alignment?: {
    vertical?: 'top' | 'center' | 'bottom';
    horizontal?: 'left' | 'center' | 'right';
    wrapText?: string;
  };
};

type ObjectItem = Record<string, any>;
type ColorItem = {
  rgb?: string;
  theme?: string;
  indexed?: string;
  tint?: string;
  auto?: string;
};
type FontItem = {
  b?: ObjectItem;
  i?: ObjectItem;
  u?: ObjectItem;
  color: ColorItem;
  name: {
    val: string;
  };
  sz: {
    val: string;
  };
};
type FillItem = {
  patternFill?: {
    patternType: string;
    fgColor: ColorItem;
    bgColor: ColorItem;
  };
  gradientFill?: {
    stop: Array<{ color: ColorItem }>;
  };
};

function xmlToJson(xml: any) {
  // Create the return object
  let obj: XMLFile = {};

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      for (const attribute of xml.attributes) {
        obj[attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.childNodes.length > 0) {
    for (const item of xml.childNodes) {
      const n = item.nodeName;
      if (typeof obj[n] == 'undefined') {
        obj[n] = xmlToJson(item);
      } else {
        if (typeof obj[n].push == 'undefined') {
          var old = obj[n];
          obj[n] = [];
          obj[n].push(old);
        }
        obj[n].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

function convertXMLToJSON(xmlStr: string) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlStr, 'text/xml');
  const json = xmlToJson(xml);
  return json;
}
function convertRGB(c?: string) {
  if (!c) {
    return '';
  }
  const colorPrefix = '#';
  if (c.length === 6) {
    return colorPrefix + c;
  }
  if (c.length === 8 && c.startsWith('FF')) {
    return colorPrefix + c.slice(2);
  }
  return '';
}
function convertColor(themeData: ThemeData, color?: ColorItem) {
  if (!color) {
    return '';
  }
  if (color.theme) {
    const themeIndex = [
      'a:lt1',
      'a:dk1',
      'a:lt2',
      'a:dk2',
      'a:accent1',
      'a:accent2',
      'a:accent3',
      'a:accent4',
      'a:accent5',
      'a:accent6',
    ];
    const i = parseInt(color.theme, 10);
    if (i >= 0 && i <= 1) {
      return convertRGB(themeData[themeIndex[i]]['a:sysClr'].lastClr);
    }
    if (i > 1 && i < themeIndex.length) {
      return convertRGB(themeData[themeIndex[i]]['a:srgbClr'].val);
    }
  }

  return convertRGB(color.rgb);
}

function getCellStyle(
  xml: XMLFile,
  styleId: number,
  themeData: ThemeData,
): Partial<StyleType> | undefined {
  const result: Partial<StyleType> = {};
  const xfList = get<XfItem[]>(xml, 'styleSheet.cellXfs.xf', []);
  if (xfList.length === 0 || !xfList[styleId]) {
    return undefined;
  }
  const xf = xfList[styleId];
  if (xf.applyAlignment && xf.alignment) {
    if (xf.alignment.horizontal) {
      const alignMap = {
        left: EHorizontalAlign.LEFT,
        center: EHorizontalAlign.CENTER,
        right: EHorizontalAlign.RIGHT,
      };
      result.horizontalAlign = alignMap[xf.alignment.horizontal];
    }
    if (xf.alignment.vertical) {
      const alignMap = {
        top: EVerticalAlign.TOP,
        center: EVerticalAlign.CENTER,
        bottom: EVerticalAlign.BOTTOM,
      };
      result.verticalAlign = alignMap[xf.alignment.vertical];
    } else {
      result.verticalAlign = EVerticalAlign.BOTTOM;
    }
    result.isWrapText = Boolean(xf.alignment.wrapText);
  }
  if (xf.applyFont && xf.fontId) {
    const fontList = get<FontItem[]>(xml, 'styleSheet.fonts.font', []);
    const fontId = parseInt(xf.fontId, 10);
    if (fontList.length > 0 && fontList[fontId]) {
      const font = fontList[fontId];
      result.fontSize = parseInt(font.sz.val, 10);
      result.isBold = Boolean(font.b);
      result.isItalic = Boolean(font.i);
      result.underline = Boolean(font.u) ? EUnderLine.SINGLE : EUnderLine.NONE;
      result.fontFamily = font.name.val;
      const color = convertColor(themeData, font.color);
      if (color) {
        result.fontColor = color;
      }
    }
  }
  if (xf.applyNumberFormat && xf.numFmtId) {
    const id = parseInt(xf.numFmtId, 10);
    if (NUMBER_FORMAT_LIST.some((v) => v.id === id)) {
      result.numberFormat = id;
    }
  }
  if (xf.applyFill && xf.fillId) {
    const list = get<FillItem[]>(xml, 'styleSheet.fills.fill', []);
    const i = parseInt(xf.fillId, 10);
    if (list.length > 0 && list[i]) {
      const g = list[i].gradientFill;
      const p = list[i].patternFill;
      if (g && g.stop[0]) {
        // TODO: handle multiple color
        const color = convertColor(themeData, g.stop[0].color);
        if (color) {
          result.fillColor = color;
        }
      } else if (p) {
        const color = convertColor(themeData, p.fgColor);
        if (color) {
          result.fillColor = color;
        }
      }
    }
  }
  return result;
}

function convertXMLDataToModel(xmlData: Record<string, XMLFile>): WorkBookJSON {
  const workbook = xmlData[WORKBOOK_PATH];
  const themeData = get<ThemeData>(
    xmlData[THEME_PATH],
    'a:theme.a:themeElements.a:clrScheme',
    {},
  );

  const result: WorkBookJSON = {
    workbook: [],
    worksheets: {},
    mergeCells: [],
    customHeight: {},
    customWidth: {},
    definedNames: {},
  };
  const sheetPathMap: Record<string, string> = {};
  const sheetMap: Record<string, string> = {};
  for (const item of get<RelationItem[]>(
    xmlData[WORKBOOK_RELATION_PATH],
    'Relationships.Relationship',
    [],
  )) {
    if (!item) {
      continue;
    }
    sheetMap[item.Id] = item.Target;
  }
  let sheetList: SheetItem[] = get(workbook, 'workbook.sheets.sheet', []);
  if (!Array.isArray(sheetList)) {
    sheetList = [sheetList];
  }
  for (const item of sheetList) {
    if (!item) {
      continue;
    }
    const sheetPath = `${COMMON_PREFIX}/${sheetMap[item['r:id']]}`;
    sheetPathMap[item.sheetId] = sheetPath;
    const range = parseReference(
      get<string>(
        xmlData[sheetPath],
        'worksheet.sheetViews.sheetView.selection.sqref',
        '',
      ),
    )!;
    range.sheetId = item.sheetId;
    result.workbook.push({
      sheetId: item.sheetId,
      name: item.name,
      isHide: item.state === 'hidden',
      activeCell: range,
      rowCount: 200,
      colCount: 200,
    });
  }
  for (const item of result.workbook) {
    const sheetPath = sheetPathMap[item.sheetId];
    let sheetData: SheetDataRowItem[] = get(
      xmlData[sheetPath],
      'worksheet.sheetData.row',
    );
    if (!Array.isArray(sheetData)) {
      sheetData = [sheetData];
    }
    if (sheetData.length === 0) {
      continue;
    }
    result.worksheets[item.sheetId] = {};

    for (const row of sheetData) {
      if (!row) {
        continue;
      }
      const realRow = parseInt(row.r, 10) - 1;
      result.worksheets[item.sheetId][realRow] = {};
      const colList = Array.isArray(row.c) ? row.c : [row.c];
      for (const col of colList) {
        if (!col) {
          continue;
        }
        const range = parseCell(col.r)!;
        const val = col.v['#text'] || '';
        const styleId = parseInt(col.s, 10);
        const t: ModelCellType = {
          style: getCellStyle(xmlData[STYLE_PATH], styleId, themeData),
        };

        if (val.startsWith('=')) {
          t.formula = val;
        } else {
          t.value = val;
        }
        result.worksheets[item.sheetId][realRow][range.col] = t;
      }
    }
  }
  return result;
}

export async function importXLSX(file: File) {
  const jszip = await import('jszip');
  const zip = await jszip.default.loadAsync(file);
  const { files } = zip;
  const result: Record<string, XMLFile> = {};
  for (const key of Object.keys(files)) {
    if (files[key].dir) {
      continue;
    }
    const check =
      [STYLE_PATH, WORKBOOK_PATH, WORKBOOK_RELATION_PATH, THEME_PATH].includes(
        key,
      ) || key.startsWith(SHEET_PATH_PREFIX);
    if (!check) {
      continue;
    }

    const t = await files[key].async('string');
    if (t) {
      result[key] = convertXMLToJSON(t);
    }
  }
  reactLog('xml data', result);
  const model = convertXMLDataToModel(result);
  reactLog('model data', model);
  return model;
}
