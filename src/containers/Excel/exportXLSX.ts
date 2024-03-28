import {
  IController,
  CustomHeightOrWidthItem,
  EUnderLine,
  StyleType,
  EVerticalAlign,
  EHorizontalAlign,
} from '@/types';
import { CONFIG } from './exportConfig';
import {
  saveAs,
  convertToReference,
  isEmpty,
  stringToCoordinate,
  convertResultTypeToString,
  convertColorToHex,
  getCustomWidthOrHeightKey,
  NUMBER_FORMAT_LIST,
} from '@/util';
import { CUSTOM_WIdTH_RADIO, XfItem } from './importXLSX';
interface StyleData {
  cellXfs: string[];
  numFmts: string[];
  fonts: string[];
  fills: string[];
}

const SPLITTER = '/';

type CommonData = {
  size: string;
  children: string;
  large: string;
  larger: string;
};

function convertColorToRGB(val: string) {
  const t = convertColorToHex(val);
  return `FF${t.slice(1, -2)}`;
}

function convertStyle(styles: StyleData, style: Partial<StyleType>) {
  if (!style || isEmpty(style)) {
    return;
  }
  const extraList: string[] = [];
  const result: XfItem = {
    fontId: '0',
    fillId: '0',
    numFmtId: '0',
    applyAlignment: '',
    applyFill: '',
    applyFont: '',
    applyNumberFormat: '',
  };
  if (style.fillColor) {
    result.fillId = String(styles.fills.length);
    extraList.push('applyFill="1"');
    styles.fills.push(`<fill>
    <patternFill patternType="solid">
      <fgColor rgb="${convertColorToRGB(style.fillColor)}"/>
      <bgColor indexed="64"/>
    </patternFill>
  </fill>`);
  }
  const fontList: string[] = [];
  if (
    style.underline === EUnderLine.SINGLE ||
    style.underline === EUnderLine.DOUBLE
  ) {
    fontList.push('<u/>');
  }
  if (style.isBold) {
    fontList.push('<b/>');
  }
  if (style.isItalic) {
    fontList.push('<i/>');
  }
  if (style.isStrike) {
    fontList.push('<strike/>');
  }
  if (typeof style.fontSize !== 'undefined') {
    fontList.push(`<sz val="${style.fontSize}"/>`);
  }
  if (style.fontColor) {
    fontList.push(`<color rgb="${convertColorToRGB(style.fontColor)}"/>`);
  }
  if (style.fontFamily) {
    fontList.push(`<name val="${style.fontFamily}"/>`);
  }

  if (fontList.length > 0) {
    result.fontId = String(styles.fonts.length);
    extraList.push('applyFont="1"');
    styles.fonts.push(
      `<font>${fontList.join(
        '',
      )}<charset val="0"/><scheme val="minor"/></font>`,
    );
  }

  const item = NUMBER_FORMAT_LIST.find((v) => v.id === style.numberFormat);
  if (item) {
    extraList.push('applyNumberFormat="1"');
    result.numFmtId = String(style.numberFormat);
    styles.numFmts.push(
      `<numFmt numFmtId="${style.numberFormat}" formatCode="${item.formatCode}"/>`,
    );
  }
  let alignment = '<alignment vertical="center"/>';
  if (
    style.isWrapText ||
    style.horizontalAlign !== undefined ||
    style.verticalAlign !== undefined
  ) {
    const list: string[] = [];
    extraList.push('applyAlignment="1"');
    if (style.isWrapText) {
      list.push('wrapText="1"');
    }
    if (style.horizontalAlign !== undefined) {
      const alignMap = {
        [EHorizontalAlign.LEFT]: 'left',
        [EHorizontalAlign.CENTER]: 'center',
        [EHorizontalAlign.RIGHT]: 'right',
      };
      list.push(`horizontal="${alignMap[style.horizontalAlign]}"`);
    }
    if (style.verticalAlign !== undefined) {
      const alignMap = {
        [EVerticalAlign.TOP]: 'top',
        [EVerticalAlign.CENTER]: 'center',
        [EVerticalAlign.BOTTOM]: 'bottom',
      };
      if (style.verticalAlign !== EVerticalAlign.BOTTOM) {
        list.push(`vertical="${alignMap[style.verticalAlign]}"`);
      }
    }
    alignment = `<alignment ${list.join(' ')}/>`;
  }

  const t = `<xf numFmtId="${result.numFmtId}" fontId="${
    result.fontId
  }" fillId="${result.fillId}" borderId="0" xfId="0" ${extraList.join(
    ' ',
  )}>${alignment}</xf>`;
  styles.cellXfs.push(t);
}
function compileTemplate(template: string, target: Partial<CommonData> = {}) {
  const result = template.replace(/{([a-z]+)}/g, function (_, key) {
    const t = key.trim();
    if (t in target) {
      // @ts-ignore
      return target[t];
    }
    throw new Error(`not found key: ${key}`);
  });
  return result;
}

function formatDate() {
  const d = new Date();

  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  const hours = ('0' + d.getHours()).slice(-2);
  const minutes = ('0' + d.getMinutes()).slice(-2);
  const seconds = ('0' + d.getSeconds()).slice(-2);

  const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

  return formattedDate;
}

function getCustomWidth(
  customWidthMap: CustomHeightOrWidthItem,
  sheetId: string,
) {
  const list: string[] = [];
  for (const [key, value] of Object.entries(customWidthMap)) {
    if (!key.startsWith(sheetId) || !value) {
      continue;
    }
    const t = parseInt(key.slice(sheetId.length + 1), 10) + 1;
    list.push(
      `<col min="${t}" max="${t}" width="${
        value.len / CUSTOM_WIdTH_RADIO
      }" customWidth="1" ${value.isHide ? 'hidden="1"' : ''}/>`,
    );
  }
  if (list.length === 0) {
    return '';
  }
  return list.join('');
}

export function convertToXMLData(controller: IController) {
  const model = controller.toJSON();
  const sheetList = Object.values(model.workbook);

  const sheetRelMap: Record<
    string,
    { rid: string; target: string; name: string }
  > = {};
  for (let i = 0; i < sheetList.length; i++) {
    const t = sheetList[i];
    const a = i + 1;
    sheetRelMap[t.sheetId] = {
      rid: `rId${a}`,
      target: `sheet${a}.xml`,
      name: t.name,
    };
  }

  const convertSheetIdToSheetName = (sheetId: string) => {
    const id = sheetId || model.currentSheetId;
    return sheetList.find((v) => v.sheetId === id)?.name || '';
  };
  const defineNames: string[] = [];
  for (const [name, range] of Object.entries(model.definedNames)) {
    const text = convertToReference(
      range,
      'absolute',
      convertSheetIdToSheetName,
    );
    defineNames.push(`<definedName name="${name}">${text}</definedName>`);
  }
  const activeIndex = sheetList.findIndex(
    (v) => v.sheetId === model.currentSheetId,
  );

  const result: Record<string, string> = {};
  result['_rels/.rels'] = CONFIG['_rels/.rels'];
  result['docProps/app.xml'] = compileTemplate(CONFIG['docProps/app.xml'], {
    children: sheetList.map((v) => `<vt:lpstr>${v.name}</vt:lpstr>`).join(''),
    size: String(sheetList.length),
  });
  result['docProps/core.xml'] = compileTemplate(CONFIG['docProps/core.xml'], {
    children: formatDate(),
  });
  result['xl/_rels/workbook.xml.rels'] = compileTemplate(
    CONFIG['xl/_rels/workbook.xml.rels'],
    {
      children: sheetList
        .map((v) => {
          const item = sheetRelMap[v.sheetId];
          return `<Relationship Id="${item.rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/${item.target}"/>`;
        })
        .join(''),
      size: `<Relationship Id="rId${String(
        sheetList.length + 1,
      )}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
      <Relationship Id="rId${String(
        sheetList.length + 2,
      )}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
      <Relationship Id="rId${String(
        sheetList.length + 3,
      )}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>`,
    },
  );
  // TODO
  // if (Object.keys(model.drawings).length > 0) {
  //   result['xl/drawings/_rels/drawing1.xml.rels'] = compileTemplate(
  //     CONFIG['xl/drawings/_rels/drawing1.xml.rels'],
  //   );
  // }
  result['xl/theme/theme1.xml'] = CONFIG['xl/theme/theme1.xml'];
  result['xl/worksheets/_rels/sheet1.xml.rels'] =
    CONFIG['xl/worksheets/_rels/sheet1.xml.rels'];
  result['xl/sharedStrings.xml'] = CONFIG['xl/sharedStrings.xml'];
  result['xl/styles.xml'] = CONFIG['xl/styles.xml'];

  result['xl/workbook.xml'] = compileTemplate(CONFIG['xl/workbook.xml'], {
    size: activeIndex >= 0 ? ` activeTab="${activeIndex}" ` : '',
    large:
      defineNames.length > 0
        ? `<definedNames>${defineNames.join('')}</definedNames>`
        : '',
    children: sheetList
      .map((v) => {
        const item = sheetRelMap[v.sheetId];
        return `<sheet name="${v.name}" sheetId="${v.sheetId}" r:id="${item.rid}"/>`;
      })
      .join(''),
  });
  result['[Content_Types].xml'] = compileTemplate(
    CONFIG['[Content_Types].xml'],
    {
      children: sheetList
        .map((v) => {
          const item = sheetRelMap[v.sheetId];
          return `<Override PartName="/xl/worksheets/${item.target}" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`;
        })
        .join(''),
    },
  );
  const styles: StyleData = {
    cellXfs: [
      `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0">
    <alignment vertical="center"/>
  </xf>`,
    ],
    numFmts: [],
    fonts: [
      `<font>
    <sz val="11"/>
    <color theme="1"/>
    <name val="Calibri"/>
    <charset val="134"/>
    <scheme val="minor"/>
  </font>`,
    ],
    fills: [
      `<fill>
    <patternFill patternType="none"/>
  </fill>`,
    ],
  };
  for (const item of sheetList) {
    const v = sheetRelMap[item.sheetId];
    const range = model.rangeMap[item.sheetId] || {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    };
    range.sheetId = '';
    const cellData = model.worksheets[item.sheetId];
    const targetData: Partial<CommonData> = {
      children: '',
      size: getCustomWidth(model.customWidth, item.sheetId),
      large: `<sheetView ${
        item.sheetId === model.currentSheetId ? 'tabSelected="1"' : ''
      } workbookViewId="0">
    <selection activeCell="${convertToReference({
      ...range,
      rowCount: 1,
      colCount: 1,
    })}" sqref="${convertToReference(range)}"/>
  </sheetView>`,
    };
    if (isEmpty(cellData)) {
      result[`xl/worksheets/${v.target}`] = compileTemplate(
        CONFIG['xl/worksheets/sheet1.xml'],
        targetData,
      );
      continue;
    }
    const rowMap = new Map<number, string[]>();
    const rowList: string[] = [];
    for (const [key, v] of Object.entries(cellData)) {
      const range = stringToCoordinate(key);
      const ref = convertToReference({
        ...range,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      const list = rowMap.get(range.row) || [];
      const f = v.formula ? `<f>=${v.formula.slice(1)}</f>` : '';
      const val = `<v>${convertResultTypeToString(v.value)}</v>`;
      let s = '';
      if (v.style && !isEmpty(v.style)) {
        s = `s="${styles.cellXfs.length}"`;
        convertStyle(styles, v.style);
      }
      list.push(`<c r="${ref}" ${s}>${f}${val}</c>`);
      rowMap.set(range.row, list);
    }
    const rowKeyList = Array.from(rowMap.keys());
    rowKeyList.sort();

    for (const row of rowKeyList) {
      const customHeight =
        model.customHeight[getCustomWidthOrHeightKey(item.sheetId, row)];
      let ht = '';
      if (customHeight) {
        ht = `ht="${customHeight.len}" customHeight="1" ${
          customHeight.isHide ? 'hidden="1"' : ''
        }`;
      }
      rowList.push(
        `<row r="${row + 1}" ${ht}>\n${rowMap.get(row)!.join('\n')}\n</row>`,
      );
    }
    targetData.children = rowList.join('\n');
    result[`xl/worksheets/${v.target}`] = compileTemplate(
      CONFIG['xl/worksheets/sheet1.xml'],
      targetData,
    );
  }
  result['xl/styles.xml'] = compileTemplate(CONFIG['xl/styles.xml'], {
    children: `<cellXfs count="${styles.cellXfs.length}">
    ${styles.cellXfs.join('')}
    </cellXfs>`,
    size: `<numFmts count="${styles.numFmts.length}">
  ${styles.numFmts.join('\n')}
  </numFmts>
  <fonts count="${styles.fonts.length}">
  ${styles.fonts.join('\n')}
  </fonts>
  <fills count="${styles.fills.length}">
  ${styles.fills.join('\n')}
  </fills>`,
  });
  return result;
}

export async function exportXLSX(fileName: string, controller: IController) {
  const result = convertToXMLData(controller);
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  const folderMap = new Map<string, typeof JSZip>();
  const generateFolder = (list: string[]) => {
    if (list.length === 0) {
      return;
    }
    for (let i = 0; i < list.length; i++) {
      if (i === 0) {
        if (!folderMap.has(list[i])) {
          folderMap.set(list[i], zip.folder(list[i])!);
        }
      } else {
        const old = list.slice(0, i).join(SPLITTER);
        const newName = list.slice(0, i + 1).join(SPLITTER);
        if (!folderMap.has(newName)) {
          folderMap.set(newName, folderMap.get(old)!.folder(list[i])!);
        }
      }
    }
  };
  for (const [key, value] of Object.entries(result)) {
    const list = key
      .split(SPLITTER)
      .map((v) => v.trim())
      .filter((v) => v);
    const fileName = list.pop()!;
    generateFolder(list);
    if (list.length === 0) {
      zip.file(fileName, value);
    } else {
      const f = folderMap.get(list.join(SPLITTER));
      f!.file(fileName, value);
    }
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, fileName);
}
