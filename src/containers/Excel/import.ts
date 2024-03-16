import {
  WorkBookJSON,
  WorksheetType,
  ModelCellType,
  StyleType,
  EHorizontalAlign,
  EVerticalAlign,
  EUnderLine,
  FloatElement,
} from '@/types';
import {
  get,
  parseReference,
  NUMBER_FORMAT_LIST,
  CELL_HEIGHT,
  CELL_WIDTH,
  XLSX_MAX_ROW_COUNT,
  XLSX_MAX_COL_COUNT,
  coordinateToString,
  getCustomWidthOrHeightKey,
  generateUUID,
} from '@/util';

const COMMON_PREFIX = 'xl';
const STYLE_PATH = 'xl/styles.xml';
const WORKBOOK_PATH = 'xl/workbook.xml';
const WORKBOOK_RELATION_PATH = 'xl/_rels/workbook.xml.rels';
const THEME_PATH = 'xl/theme/theme1.xml';
const SHARED_STRINGS = 'xl/sharedStrings.xml';
const textKey = '#text';
const DRAWING_PREFIX_KEY = 'xl/drawings/';
const DRAWING_FLAG = '../drawings/';

const imageTypeMap = {
  'image/apng': ['.apng'],
  'image/bmp': ['.bmp'],
  'image/x-icon': ['.ico', '.cur'],
  // 'image/tiff': ['.tif', '.tiff'], // only Safari
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/svg+xml': ['.svg'],
  'image/avif': ['.avif'],
  'image/gif': ['.gif'],
  'image/jpeg': ['.jpeg', '.jpg', '.jfif', '.pjpeg', '.pjp'],
} as const;

const chartTypeList = [
  // 'area',
  'bar',
  // 'bubble',
  // 'doughnut',
  'line',
  'pie',
  // 'ofPie',
  // 'radar',
  // 'scatter',
  // 'surface',
] as const;

export const CUSTOM_WIdTH_RADIO = 8;

type SharedStringItem = {
  t?: {
    [textKey]: string;
  };
};
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
interface RelationItem {
  Id: string;
  Target: string;
  Type?: string;
}

interface ColItem {
  r: string;
  s: string;
  t?: string;
  v?: {
    [textKey]: string;
  };
}
interface SheetDataRowItem {
  customHeight?: string;
  hidden?: string;
  ht?: string;
  r: string;
  c: ColItem[];
}

interface CustomColItem {
  min: string;
  max: string;
  width: string;
  customWidth: string;
  hidden?: string;
}

type ChartData = {
  'xdr:from': {
    'xdr:col': {
      [textKey]: string;
    };
    'xdr:row': {
      [textKey]: string;
    };
  };
  'xdr:graphicFrame'?: {
    'xdr:nvGraphicFramePr': {
      'xdr:cNvPr': {
        id: string;
        name: string;
        descr?: string;
        title?: string;
      };
    };
    'a:graphic': {
      'a:graphicData': {
        'c:chart': {
          'r:id': string;
        };
      };
    };
  };
  'xdr:pic'?: {
    'xdr:nvPicPr': {
      'xdr:cNvPr': {
        id: string;
        name: string;
        descr?: string;
        title?: string;
      };
    };
    'xdr:blipFill': {
      'a:blip': {
        'r:embed': string;
      };
    };
  };
};

export interface XfItem {
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
}

type ObjectItem = Record<string, any>;
interface ColorItem {
  rgb?: string;
  theme?: string;
  indexed?: string;
  tint?: string;
  auto?: string;
}
interface FontItem {
  b?: ObjectItem;
  i?: ObjectItem;
  u?: ObjectItem;
  strike?: ObjectItem;
  color: ColorItem;
  name?: {
    val: string;
  };
  sz?: {
    val: string;
  };
}
interface FillItem {
  patternFill?: {
    patternType: string;
    fgColor: ColorItem;
    bgColor: ColorItem;
  };
  gradientFill?: {
    stop: Array<{ color: ColorItem }>;
  };
}

interface DefineNameItem {
  name: string;
  [textKey]: string;
}

function xmlToJson(xml: any) {
  // Create the return object
  let obj: ObjectItem = {};

  if (xml.nodeType === Node.ELEMENT_NODE) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      for (const attribute of xml.attributes) {
        obj[attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === Node.TEXT_NODE) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.childNodes.length > 0) {
    for (const item of xml.childNodes) {
      const n = item.nodeName;
      // clear empty text
      if (typeof item.nodeValue === 'string' && !item.nodeValue.trim()) {
        continue;
      }
      if (typeof obj[n] === 'undefined') {
        obj[n] = xmlToJson(item);
      } else {
        if (typeof obj[n].push === 'undefined') {
          obj[n] = [obj[n]];
        }
        obj[n].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

export function convertXMLToJSON(xmlStr: string) {
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
  xml: ObjectItem,
  styleId: number,
  themeData: ThemeData,
): Partial<StyleType> {
  const result: Partial<StyleType> = {};
  const xfList = get<XfItem[]>(xml, 'styleSheet.cellXfs.xf', []);
  if (!styleId || xfList.length === 0 || !xfList[styleId]) {
    return result;
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
    if (!isNaN(fontId) && fontList.length > 0 && fontList[fontId]) {
      const font = fontList[fontId];
      const fz = font?.sz?.val ? parseInt(font?.sz?.val, 10) : undefined;
      result.fontSize = fz ? fz : undefined;
      result.isBold = Boolean(font?.b);
      result.isItalic = Boolean(font?.i);
      result.isStrike = Boolean(font?.strike);
      result.underline = font.u ? EUnderLine.SINGLE : EUnderLine.NONE;
      result.fontFamily = font?.name?.val;
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
    if (list.length > 0 && !isNaN(i) && list[i]) {
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

export function convertXMLDataToModel(xmlData: ObjectItem): WorkBookJSON {
  const workbook = xmlData[WORKBOOK_PATH];

  let sharedStrings: SharedStringItem[] = get(
    xmlData[SHARED_STRINGS],
    'sst.si',
    [],
  );
  if (!Array.isArray(sharedStrings)) {
    sharedStrings = [sharedStrings];
  }
  const themeData = get<ThemeData>(
    xmlData[THEME_PATH],
    'a:theme.a:themeElements.a:clrScheme',
    {},
  );

  const result: WorkBookJSON = {
    workbook: {},
    mergeCells: {},
    customHeight: {},
    customWidth: {},
    definedNames: {},
    currentSheetId: '',
    drawings: {},
    rangeMap: {},
    worksheets: {},
  };
  const relationList = get<RelationItem[]>(
    xmlData[WORKBOOK_RELATION_PATH],
    'Relationships.Relationship',
    [],
  );
  const sheetPathMap: Record<string, string> = {};
  const drawingMap: Record<string, string[]> = {};
  let drawingCount = 0;
  let sheetList: SheetItem[] = get(workbook, 'workbook.sheets.sheet', []);
  if (!Array.isArray(sheetList)) {
    sheetList = [sheetList];
  }
  let sheetSort = 0;
  for (const item of sheetList) {
    if (!item) {
      continue;
    }
    const sheetTarget =
      relationList.find((v) => v.Id === item['r:id'])?.Target || '';
    const worksheetPrefix = 'worksheets/';
    const baseSheet = sheetTarget.slice(worksheetPrefix.length);
    const refPath = `${COMMON_PREFIX}/${worksheetPrefix}_rels/${baseSheet}.rels`;
    if (xmlData[refPath]) {
      let list: RelationItem[] = get(
        xmlData[refPath],
        'Relationships.Relationship',
        [],
      );
      if (!Array.isArray(list)) {
        list = [list];
      }
      for (const v of list) {
        if (!drawingMap[item.sheetId]) {
          drawingMap[item.sheetId] = [];
        }
        drawingMap[item.sheetId].push(v.Target);
        if (v.Target.startsWith(DRAWING_FLAG)) {
          drawingCount++;
        }
      }
    }
    const sheetPath = `${COMMON_PREFIX}/${sheetTarget}`;
    sheetPathMap[item.sheetId] = sheetPath;
    const range = parseReference(
      get<string>(
        xmlData[sheetPath],
        'worksheet.sheetViews.sheetView.selection.sqref',
        '',
      ),
    )!;
    const tabSelected = get<string>(
      xmlData[sheetPath],
      'worksheet.sheetViews.sheetView.tabSelected',
      '',
    );
    if (tabSelected === '1') {
      result.currentSheetId = item.sheetId;
    }
    const sheetData = {
      sheetId: item.sheetId,
      name: item.name,
      isHide: item.state === 'hidden',
      rowCount: 200,
      colCount: 200,
      sort: sheetSort++,
    };
    result.workbook[sheetData.sheetId] = sheetData;
    if (range) {
      result.rangeMap[item.sheetId] = range;
      range.sheetId = item.sheetId;
    }
  }
  const sheets = Object.values(result.workbook);
  sheets.sort((a, b) => a.sort - b.sort);
  result.currentSheetId = result.currentSheetId || sheets[0].sheetId;

  for (const item of sheets) {
    const sheetPath = sheetPathMap[item.sheetId];
    let sheetData: SheetDataRowItem[] = get(
      xmlData[sheetPath],
      'worksheet.sheetData.row',
    );
    if (!Array.isArray(sheetData)) {
      sheetData = [sheetData];
    }
    let customWidth: CustomColItem[] = get(
      xmlData[sheetPath],
      'worksheet.cols.col',
      [],
    );
    customWidth = Array.isArray(customWidth) ? customWidth : [customWidth];
    const defaultWOrH = get(xmlData[sheetPath], 'worksheet.sheetFormatPr', {
      defaultColWidth: '',
      defaultRowHeight: '',
      outlineLevelRow: '',
    });
    if (customWidth.length > 0) {
      for (const col of customWidth) {
        if (col && col.customWidth && col.width && col.min && col.max) {
          const isDefault = defaultWOrH.defaultColWidth === col.width;
          const w = isDefault
            ? CELL_WIDTH
            : parseFloat(col.width) * CUSTOM_WIdTH_RADIO;
          const isHide = Boolean(col.hidden);
          for (
            let start = parseInt(col.min, 10) - 1, end = parseInt(col.max, 10);
            start < end;
            start++
          ) {
            result.customWidth[getCustomWidthOrHeightKey(item.sheetId, start)] =
              {
                len: w,
                isHide,
              };
          }
        }
      }
    }

    if (sheetData.length === 0) {
      continue;
    }

    let { colCount } = item;
    let { rowCount } = item;
    for (const row of sheetData) {
      if (!row) {
        continue;
      }
      const realRow = parseInt(row.r, 10) - 1;
      rowCount = Math.max(rowCount, realRow + 1);
      if (rowCount > XLSX_MAX_ROW_COUNT) {
        continue;
      }
      if (row.customHeight && row.ht) {
        const isDefault = defaultWOrH.defaultRowHeight === row.ht;
        result.customHeight[getCustomWidthOrHeightKey(item.sheetId, realRow)] =
          {
            len: isDefault ? CELL_HEIGHT : parseFloat(row.ht),
            isHide: Boolean(row.hidden),
          };
      }
      const colList = Array.isArray(row.c) ? row.c : [row.c];
      for (const col of colList) {
        if (!col) {
          continue;
        }
        const range = parseReference(col.r)!;
        if (!range) {
          continue;
        }
        colCount = Math.max(colCount, range.col + 1);
        if (colCount > XLSX_MAX_COL_COUNT) {
          continue;
        }
        let val = col?.v?.[textKey] || '';
        const styleId = parseInt(col.s, 10);
        const style = getCellStyle(xmlData[STYLE_PATH], styleId, themeData);
        const t: ModelCellType = {
          style,
        };
        if (col.t === 's') {
          const i = parseInt(val, 10);
          if (!isNaN(i)) {
            const data = sharedStrings[i];
            const text = data?.t?.[textKey] || '';
            if (text) {
              val = text;
            }
          }
        }
        if (val.startsWith('=')) {
          t.formula = val;
        } else {
          t.value = val;
        }

        result.worksheets[item.sheetId] = result.worksheets[item.sheetId] || {};
        result.worksheets[item.sheetId][
          coordinateToString(realRow, range.col)
        ] = t;
        colCount = Math.max(colCount, range.col + 1);
      }
    }
    item.rowCount = Math.max(item.rowCount, rowCount);
    item.colCount = Math.max(item.colCount, colCount);
  }

  let definedNames: DefineNameItem[] = get(
    workbook,
    'workbook.definedNames.definedName',
    [],
  );
  definedNames = Array.isArray(definedNames) ? definedNames : [definedNames];
  const convertSheetName = (sheetName: string) => {
    const list = Object.values(result.workbook);
    return list.find((v) => v.name === sheetName)?.sheetId || '';
  };
  for (const item of definedNames) {
    const range = parseReference(item[textKey], convertSheetName);
    if (range && range.sheetId && range.isValid() && item?.name) {
      result.definedNames[item.name.toLowerCase()] = range.toIRange();
    }
  }
  for (let drawingId = 1; drawingId <= drawingCount; drawingId++) {
    const basePath = `drawing${drawingId}.xml`;
    const key = `${DRAWING_PREFIX_KEY}${basePath}`;
    const ref = `${DRAWING_PREFIX_KEY}_rels/${basePath}.rels`;
    if (!xmlData[key] || !xmlData[ref]) {
      break;
    }

    let relations: RelationItem[] = get(
      xmlData[ref],
      'Relationships.Relationship',
      [],
    );
    if (!Array.isArray(relations)) {
      relations = [relations];
    }
    let sheetId = '';
    for (const [id, list] of Object.entries(drawingMap)) {
      if (list.some((v) => v === DRAWING_FLAG + basePath)) {
        sheetId = id;
        break;
      }
    }

    let floatElementList: ChartData[] = get(
      xmlData[key],
      'xdr:wsDr.xdr:twoCellAnchor',
      [],
    );
    if (!Array.isArray(floatElementList)) {
      floatElementList = [floatElementList];
    }
    for (const float of floatElementList) {
      const chartId = get(
        float,
        'xdr:graphicFrame.a:graphic.a:graphicData.c:chart.r:id',
        '',
      );
      const imageId = get(float, 'xdr:pic.xdr:blipFill.a:blip.r:embed', '');
      const isImage = !!imageId;
      const rid = isImage ? imageId : chartId;
      const target = relations.find((v) => v.Id === rid)?.Target || '';
      if (!target) {
        continue;
      }
      const filePath = COMMON_PREFIX + target.slice(2);
      const fromRow = float['xdr:from']['xdr:col'][textKey];
      const fromCol = float['xdr:from']['xdr:row'][textKey];
      if (!fromRow || !fromCol) {
        continue;
      }
      const uuid = generateUUID();
      const floatElementData: FloatElement = {
        title: '',
        type: isImage ? 'floating-picture' : 'chart',
        uuid,
        width: 200,
        height: 200,
        originHeight: 200,
        originWidth: 200,
        fromCol: parseInt(fromCol, 10),
        fromRow: parseInt(fromRow, 10),
        sheetId,
        marginX: 0,
        marginY: 0,
      };

      if (isImage) {
        const name = get(float, 'xdr:pic.xdr:nvPicPr.xdr:cNvPr.name', '');
        const title = get(float, 'xdr:pic.xdr:nvPicPr.xdr:cNvPr.title', '');
        floatElementData.title = title || name;
        floatElementData.imageAngle = 0;
        floatElementData.imageSrc = xmlData[filePath];
      } else {
        floatElementData.title = get(
          xmlData[filePath],
          'c:chartSpace.c:chart.c:title.c:tx.c:rich.a:p.0.a:r.a:t.' + textKey,
          '',
        );
        let ref = '';
        for (const chartType of chartTypeList) {
          const t = get(
            xmlData[filePath],
            `c:chartSpace.c:chart.c:plotArea.c:${chartType}Chart.c:ser.0.c:val.c:numRef.c:f.${textKey}`,
            '',
          );
          if (t) {
            ref = t;
            floatElementData.chartType = chartType;
            break;
          }
        }

        if (!ref) {
          continue;
        }
        const range = parseReference(ref, (sheetName: string) => {
          const data = Object.values(result.workbook).find(
            (v) => v.name === sheetName,
          );
          return data?.sheetId || '';
        });
        if (!range) {
          continue;
        }
        floatElementData.chartRange = range;
      }

      result.drawings[uuid] = floatElementData;
    }
  }

  return result;
}

export async function importXLSX(file: File) {
  const jszip = await import('jszip');
  const zip = await jszip.default.loadAsync(file);
  const { files } = zip;
  const result: ObjectItem = {};
  for (const key of Object.keys(files)) {
    if (files[key].dir) {
      continue;
    }
    if (key.includes('.xml')) {
      const data = await files[key].async('string');
      if (data) {
        result[key] = convertXMLToJSON(data);
      }
    } else {
      let imageType = '';
      for (const [type, list] of Object.entries(imageTypeMap)) {
        if (list.some((v) => key.endsWith(v))) {
          imageType = type;
          break;
        }
      }
      if (!imageType) {
        continue;
      }
      const data = await files[key].async('base64');
      if (data) {
        result[key] = `data:${imageType};base64,${data}`;
      }
    }
  }
  const model = convertXMLDataToModel(result);
  return model;
}
