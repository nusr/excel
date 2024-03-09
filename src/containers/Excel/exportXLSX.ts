import {
  IController,
  IRange,
  StyleType,
  EUnderLine,
  EHorizontalAlign,
  EVerticalAlign,
  CustomHeightOrWidthItem,
} from '@/types';
import {
  convertToReference,
  isEmpty,
  NUMBER_FORMAT_LIST,
  saveAs,
  stringToCoordinate,
  getCustomWidthOrHeightKey,
  convertResultTypeToString,
} from '@/util';
import { XfItem, CUSTOM_WIdTH_RADIO } from './import';
import { convertColorToHex } from './color';
import {
  THEME1_XML,
  getContentTypeXml,
  REFS,
  StyleData,
  generateStyleFile,
  CUSTOM_XML,
  getCoreXML,
} from './exportConstant';

function getSheetData(
  activeCell: IRange,
  sheetData: string,
  isActiveSheet: boolean,
  customWidthMap: CustomHeightOrWidthItem,
  sheetId: string,
) {
  let customWidth = '';
  if (customWidthMap) {
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
    customWidth = `<cols>${list.join('')}</cols>`;
  }
  const realActiveCell = {
    ...activeCell,
    sheetId: '',
  };
  const v = sheetData ? `<sheetData>${sheetData}</sheetData>` : '<sheetData/>';
  const result = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
      xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
      xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing"
      xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main"
      xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
      xmlns:etc="http://www.wps.cn/officeDocument/2017/etCustomData">
      <sheetPr/>
      <dimension ref="A1:B1"/>
      <sheetViews>
        <sheetView ${isActiveSheet ? 'tabSelected="1"' : ''} workbookViewId="0">
          <selection activeCell="${convertToReference({
            row: activeCell.row,
            col: activeCell.col,
            rowCount: 1,
            colCount: 1,
            sheetId: '',
          })}" sqref="${convertToReference(realActiveCell)}"/>
        </sheetView>
      </sheetViews>
      <sheetFormatPr defaultColWidth="9" defaultRowHeight="16.8" outlineLevelCol="1"/>
      ${customWidth}
      ${v}
      <pageMargins left="0.75" right="0.75" top="1" bottom="1" header="0.5" footer="0.5"/>
      <headerFooter/>
    </worksheet>`;
  return result;
}

// TODO: convert color to rgb
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

export async function exportToXLSX(fileName: string, controller: IController) {
  const JSZip = (await import('jszip')).default;

  const modelJson = controller.toJSON();
  const currentSheetId = controller.getCurrentSheetId();
  const sheetList = Object.values(modelJson.workbook);

  const sheetRelMap: Record<string, { rid: string; target: string }> = {};
  for (let i = 0; i < sheetList.length; i++) {
    const t = sheetList[i];
    const a = i + 1;
    sheetRelMap[t.sheetId] = {
      rid: `rId${a}`,
      target: `sheet${a}.xml`,
    };
  }

  const zip = new JSZip();
  const contentTypeExtra = sheetList
    .map(
      (item) =>
        `<Override PartName="/xl/worksheets/${
          sheetRelMap[item.sheetId]!.target
        }" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
    )
    .join('');
  zip.file('[Content_Types].xml', getContentTypeXml(contentTypeExtra));

  const rel = zip.folder('_rels')!;
  rel.file('.rels', REFS);

  const docProps = zip.folder('docProps')!;
  docProps.file(
    'app.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"
  xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>WPS Spreadsheets</Application>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant>
        <vt:lpstr>工作表</vt:lpstr>
      </vt:variant>
      <vt:variant>
        <vt:i4>1</vt:i4>
      </vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="${sheetList.length}" baseType="lpstr">
      ${sheetList
        .map(
          (item) => `<vt:lpstr>${sheetRelMap[item.sheetId].target}</vt:lpstr>`,
        )
        .join('')}
    </vt:vector>
  </TitlesOfParts>
</Properties>`,
  );
  docProps.file('core.xml', getCoreXML());
  docProps.file('custom.xml', CUSTOM_XML);

  const xl = zip.folder('xl')!;
  // TODO: export style
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

  const activeIndex = sheetList.findIndex((v) => v.sheetId === currentSheetId);
  const convertSheetIdToSheetName = (sheetId: string) => {
    const id = sheetId || currentSheetId;
    return sheetList.find((v) => v.sheetId === id)?.name || '';
  };
  const defineNames: string[] = [];
  for (const name of Object.keys(modelJson.definedNames)) {
    const range = modelJson.definedNames[name];
    const text = convertToReference(
      range,
      'absolute',
      convertSheetIdToSheetName,
    );
    defineNames.push(`<definedName name="${name}">${text}</definedName>`);
  }
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
    <fileVersion appName="xl" lastEdited="3" lowestEdited="5" rupBuild="9302"/>
    <workbookPr/>
    <bookViews>
      <workbookView windowWidth="28800" windowHeight="11340" ${
        activeIndex > 0 ? `activeTab="${activeIndex}"` : ''
      } />
    </bookViews>
    <sheets>
      ${sheetList
        .map(
          (item) =>
            `<sheet name="${item.name}" sheetId="${item.sheetId}" r:id="${
              sheetRelMap[item.sheetId]!.rid
            }" ${item.isHide ? 'state="hidden"' : ''}/>`,
        )
        .join('')}
    </sheets>
    ${
      defineNames.length > 0
        ? `<definedNames>${defineNames.join('')}</definedNames>`
        : ''
    }
    <calcPr calcId="144525"/>
  </workbook>`;
  xl.file('workbook.xml', workbook);

  const xlRel = xl.folder('_rels')!;

  const workbookRel = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId${
      sheetList.length + 2
    }" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
    <Relationship Id="rId${
      sheetList.length + 1
    }" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
    ${sheetList
      .map((item) => {
        const t = sheetRelMap[item.sheetId]!;
        return `<Relationship Id="${t.rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/${t.target}"/>`;
      })
      .reverse()
      .join('')}
  </Relationships>`;
  xlRel.file('workbook.xml.rels', workbookRel);

  const theme = xl.folder('theme')!;
  theme.file('theme1.xml', THEME1_XML);

  const worksheets = xl.folder('worksheets')!;
  for (const item of sheetList) {
    const activeCell = modelJson.rangeMap[item.sheetId];
    const t = sheetRelMap[item.sheetId];
    const cellData = modelJson.worksheets[item.sheetId];
    const isActiveSheet = item.sheetId === currentSheetId;
    if (!cellData) {
      worksheets.file(
        t.target,
        getSheetData(
          activeCell,
          '',
          isActiveSheet,
          modelJson.customWidth,
          item.sheetId,
        ),
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
      const f = v.formula ? `<f>${v.formula.slice(1)}</f>` : '';
      const val = f ? '' : `<v>${convertResultTypeToString(v.value)}</v>`;
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
        modelJson.customHeight[getCustomWidthOrHeightKey(item.sheetId, row)];
      let ht = '';
      if (customHeight) {
        ht = `ht="${customHeight.len}" customHeight="1" ${
          customHeight.isHide ? 'hidden="1"' : ''
        }`;
      }
      rowList.push(
        `<row r="${row + 1}" ${ht}>${rowMap.get(row)!.join('')}</row>`,
      );
    }

    worksheets.file(
      t.target,
      getSheetData(
        activeCell,
        rowList.join(''),
        isActiveSheet,
        modelJson.customWidth,
        item.sheetId,
      ),
    );
  }

  xl.file('styles.xml', generateStyleFile(styles));

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, fileName);
}
