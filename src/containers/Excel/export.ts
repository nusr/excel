import { saveAs } from 'file-saver';
import {
  IController,
  IRange,
  ResultType,
  StyleType,
  EUnderLine,
  EHorizontalAlign,
  EVerticalAlign,
  CustomHeightOrWidthItem,
} from '@/types';
import { convertToReference, isEmpty, NUMBER_FORMAT_LIST } from '@/util';
import { XfItem, CUSTOM_WIdTH_RADIO } from './import';
import { convertColorToHex } from './color';

type StyleData = {
  cellXfs: string[];
  numFmts: string[];
  fonts: string[];
  fills: string[];
};

function processRow(row: ResultType[]) {
  let finalVal = '';
  for (let j = 0; j < row.length; j++) {
    const t = row[j] ?? '';
    let innerValue = '';
    if (t === 0) {
      innerValue = t.toString();
    }
    if (t) {
      innerValue = t.toString();
    }
    let result = innerValue.replace(/"/g, '""');
    if (result.search(/("|,|\n)/g) >= 0) {
      result = '"' + result + '"';
    }
    if (j > 0) {
      finalVal += ',';
    }
    finalVal += result;
  }
  return finalVal + '\n';
}
export function exportToCsv(fileName: string, controller: IController) {
  const sheetData =
    controller.toJSON().worksheets[controller.getCurrentSheetId()];
  let csvFile = '';
  if (sheetData) {
    for (const row of Object.keys(sheetData)) {
      if (!sheetData[row]) {
        continue;
      }
      const list: ResultType[] = [];
      const r = sheetData[row];
      for (const col of Object.keys(r)) {
        const c = r[col];
        if (!c) {
          continue;
        }
        list.push(c.formula ?? c.value);
      }
      csvFile += processRow(list);
    }
  }
  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
}

function getSheetData(
  activeCell: IRange,
  sheetData: string,
  isActiveSheet: boolean,
  customWidthMap: CustomHeightOrWidthItem,
) {
  let customWidth = '';
  if (customWidthMap) {
    const list: string[] = [];
    for (const col of Object.keys(customWidthMap)) {
      const t = parseInt(col, 10) + 1;
      list.push(
        `<col min="${t}" max="${t}" width="${
          customWidthMap[col].widthOrHeight / CUSTOM_WIdTH_RADIO
        }" customWidth="1" ${customWidthMap[col].isHide ? 'hidden="1"' : ''}/>`,
      );
    }
    customWidth = `<cols>${list.join('')}</cols>`;
  }
  const v = sheetData
    ? `<sheetData>
  ${sheetData}
</sheetData>`
    : '<sheetData/>';
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
          })}" sqref="${convertToReference(activeCell)}"/>
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
  return 'FF' + t.slice(1, -2);
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
    extraList.push(`applyFill="1"`);
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
    extraList.push(`applyFont="1"`);
    styles.fonts.push(
      `<font>${fontList.join(
        '',
      )}<charset val="0"/><scheme val="minor"/></font>`,
    );
  }

  const item = NUMBER_FORMAT_LIST.find((v) => v.id === style.numberFormat);
  if (item) {
    extraList.push(`applyNumberFormat="1"`);
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
    extraList.push(`applyAlignment="1"`);
    if (style.isWrapText) {
      list.push(`wrapText="1"`);
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

function generateStyleFile(styles: StyleData) {
  const result = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    xmlns:xr9="http://schemas.microsoft.com/office/spreadsheetml/2016/revision9">
    <numFmts count="${styles.numFmts.length}">
    ${styles.numFmts.join('\n')}
    </numFmts>
    <fonts count="${styles.fonts.length}">
    ${styles.fonts.join('\n')}
    </fonts>
    <fills count="${styles.fills.length}">
    ${styles.fills.join('\n')}
    </fills>
    <borders count="9">
      <border>
        <left/>
        <right/>
        <top/>
        <bottom/>
        <diagonal/>
      </border>
      <border>
        <left style="thin">
          <color rgb="FFB2B2B2"/>
        </left>
        <right style="thin">
          <color rgb="FFB2B2B2"/>
        </right>
        <top style="thin">
          <color rgb="FFB2B2B2"/>
        </top>
        <bottom style="thin">
          <color rgb="FFB2B2B2"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top/>
        <bottom style="medium">
          <color theme="4"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top/>
        <bottom style="medium">
          <color theme="4" tint="0.499984740745262"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left style="thin">
          <color rgb="FF7F7F7F"/>
        </left>
        <right style="thin">
          <color rgb="FF7F7F7F"/>
        </right>
        <top style="thin">
          <color rgb="FF7F7F7F"/>
        </top>
        <bottom style="thin">
          <color rgb="FF7F7F7F"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left style="thin">
          <color rgb="FF3F3F3F"/>
        </left>
        <right style="thin">
          <color rgb="FF3F3F3F"/>
        </right>
        <top style="thin">
          <color rgb="FF3F3F3F"/>
        </top>
        <bottom style="thin">
          <color rgb="FF3F3F3F"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left style="double">
          <color rgb="FF3F3F3F"/>
        </left>
        <right style="double">
          <color rgb="FF3F3F3F"/>
        </right>
        <top style="double">
          <color rgb="FF3F3F3F"/>
        </top>
        <bottom style="double">
          <color rgb="FF3F3F3F"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top/>
        <bottom style="double">
          <color rgb="FFFF8001"/>
        </bottom>
        <diagonal/>
      </border>
      <border>
        <left/>
        <right/>
        <top style="thin">
          <color theme="4"/>
        </top>
        <bottom style="double">
          <color theme="4"/>
        </bottom>
        <diagonal/>
      </border>
    </borders>
    <cellStyleXfs count="49">
      <xf numFmtId="0" fontId="0" fillId="0" borderId="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="43" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="44" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="9" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="41" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="42" fontId="0" fillId="0" borderId="0" applyFont="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="1" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="2" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="0" fillId="2" borderId="1" applyNumberFormat="0" applyFont="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="3" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="4" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="5" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="6" fillId="0" borderId="2" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="7" fillId="0" borderId="2" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="8" fillId="0" borderId="3" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="8" fillId="0" borderId="0" applyNumberFormat="0" applyFill="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="9" fillId="3" borderId="4" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="10" fillId="4" borderId="5" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="11" fillId="4" borderId="4" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="12" fillId="5" borderId="6" applyNumberFormat="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="13" fillId="0" borderId="7" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="14" fillId="0" borderId="8" applyNumberFormat="0" applyFill="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="15" fillId="6" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="16" fillId="7" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="17" fillId="8" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="9" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="10" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="11" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="12" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="13" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="14" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="15" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="16" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="17" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="18" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="19" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="20" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="21" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="22" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="23" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="24" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="25" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="26" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="27" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="28" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="29" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="30" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="19" fillId="31" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
      <xf numFmtId="0" fontId="18" fillId="32" borderId="0" applyNumberFormat="0" applyBorder="0" applyAlignment="0" applyProtection="0">
        <alignment vertical="center"/>
      </xf>
    </cellStyleXfs>
    <cellXfs count="${styles.cellXfs.length}">
    ${styles.cellXfs.join('\n')}
    </cellXfs>
    <cellStyles count="49">
      <cellStyle name="Normal" xfId="0" builtinId="0"/>
      <cellStyle name="Comma" xfId="1" builtinId="3"/>
      <cellStyle name="Currency" xfId="2" builtinId="4"/>
      <cellStyle name="Percent" xfId="3" builtinId="5"/>
      <cellStyle name="Comma [0]" xfId="4" builtinId="6"/>
      <cellStyle name="Currency [0]" xfId="5" builtinId="7"/>
      <cellStyle name="Hyperlink" xfId="6" builtinId="8"/>
      <cellStyle name="Followed Hyperlink" xfId="7" builtinId="9"/>
      <cellStyle name="Note" xfId="8" builtinId="10"/>
      <cellStyle name="Warning Text" xfId="9" builtinId="11"/>
      <cellStyle name="Title" xfId="10" builtinId="15"/>
      <cellStyle name="CExplanatory Text" xfId="11" builtinId="53"/>
      <cellStyle name="Heading 1" xfId="12" builtinId="16"/>
      <cellStyle name="Heading 2" xfId="13" builtinId="17"/>
      <cellStyle name="Heading 3" xfId="14" builtinId="18"/>
      <cellStyle name="Heading 4" xfId="15" builtinId="19"/>
      <cellStyle name="Input" xfId="16" builtinId="20"/>
      <cellStyle name="Output" xfId="17" builtinId="21"/>
      <cellStyle name="Calculation" xfId="18" builtinId="22"/>
      <cellStyle name="Check Cell" xfId="19" builtinId="23"/>
      <cellStyle name="Linked Cell" xfId="20" builtinId="24"/>
      <cellStyle name="Total" xfId="21" builtinId="25"/>
      <cellStyle name="Good" xfId="22" builtinId="26"/>
      <cellStyle name="Bad" xfId="23" builtinId="27"/>
      <cellStyle name="Neutral" xfId="24" builtinId="28"/>
      <cellStyle name="Accent1" xfId="25" builtinId="29"/>
      <cellStyle name="20% - Accent1" xfId="26" builtinId="30"/>
      <cellStyle name="40% - Accent1" xfId="27" builtinId="31"/>
      <cellStyle name="60% - Accent1" xfId="28" builtinId="32"/>
      <cellStyle name="Accent2" xfId="29" builtinId="33"/>
      <cellStyle name="20% - Accent2" xfId="30" builtinId="34"/>
      <cellStyle name="40% - Accent2" xfId="31" builtinId="35"/>
      <cellStyle name="60% - Accent2" xfId="32" builtinId="36"/>
      <cellStyle name="Accent3" xfId="33" builtinId="37"/>
      <cellStyle name="20% - Accent3" xfId="34" builtinId="38"/>
      <cellStyle name="40% - Accent3" xfId="35" builtinId="39"/>
      <cellStyle name="60% - Accent3" xfId="36" builtinId="40"/>
      <cellStyle name="Accent4" xfId="37" builtinId="41"/>
      <cellStyle name="20% - Accent4" xfId="38" builtinId="42"/>
      <cellStyle name="40% - Accent4" xfId="39" builtinId="43"/>
      <cellStyle name="60% - Accent4" xfId="40" builtinId="44"/>
      <cellStyle name="Accent5" xfId="41" builtinId="45"/>
      <cellStyle name="20% - Accent5" xfId="42" builtinId="46"/>
      <cellStyle name="40% - Accent5" xfId="43" builtinId="47"/>
      <cellStyle name="60% - Accent5" xfId="44" builtinId="48"/>
      <cellStyle name="Accent6" xfId="45" builtinId="49"/>
      <cellStyle name="20% - Accent6" xfId="46" builtinId="50"/>
      <cellStyle name="40% - Accent6" xfId="47" builtinId="51"/>
      <cellStyle name="60% - Accent6" xfId="48" builtinId="52"/>
    </cellStyles>
    <dxfs count="17">
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <border>
          <top style="double">
            <color theme="4"/>
          </top>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="0"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4"/>
            <bgColor theme="4"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <font>
          <color theme="1"/>
        </font>
        <border>
          <left style="thin">
            <color theme="4"/>
          </left>
          <right style="thin">
            <color theme="4"/>
          </right>
          <top style="thin">
            <color theme="4"/>
          </top>
          <bottom style="thin">
            <color theme="4"/>
          </bottom>
          <horizontal style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </horizontal>
        </border>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <color theme="1"/>
        </font>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <border>
          <top style="thin">
            <color theme="4"/>
          </top>
          <bottom style="thin">
            <color theme="4"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <top style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </top>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
      <dxf>
        <font>
          <b val="1"/>
          <color theme="1"/>
        </font>
        <fill>
          <patternFill patternType="solid">
            <fgColor theme="4" tint="0.799981688894314"/>
            <bgColor theme="4" tint="0.799981688894314"/>
          </patternFill>
        </fill>
        <border>
          <bottom style="thin">
            <color theme="4" tint="0.399975585192419"/>
          </bottom>
        </border>
      </dxf>
    </dxfs>
    <tableStyles count="2" defaultTableStyle="TableStylePreset3_Accent1" defaultPivotStyle="PivotStylePreset2_Accent1">
      <tableStyle name="TableStylePreset3_Accent1" pivot="0" count="7" xr9:uid="{59DB682C-5494-4EDE-A608-00C9E5F0F923}">
        <tableStyleElement type="wholeTable" dxfId="6"/>
        <tableStyleElement type="headerRow" dxfId="5"/>
        <tableStyleElement type="totalRow" dxfId="4"/>
        <tableStyleElement type="firstColumn" dxfId="3"/>
        <tableStyleElement type="lastColumn" dxfId="2"/>
        <tableStyleElement type="firstRowStripe" dxfId="1"/>
        <tableStyleElement type="firstColumnStripe" dxfId="0"/>
      </tableStyle>
      <tableStyle name="PivotStylePreset2_Accent1" table="0" count="10" xr9:uid="{267968C8-6FFD-4C36-ACC1-9EA1FD1885CA}">
        <tableStyleElement type="headerRow" dxfId="16"/>
        <tableStyleElement type="totalRow" dxfId="15"/>
        <tableStyleElement type="firstRowStripe" dxfId="14"/>
        <tableStyleElement type="firstColumnStripe" dxfId="13"/>
        <tableStyleElement type="firstSubtotalRow" dxfId="12"/>
        <tableStyleElement type="secondSubtotalRow" dxfId="11"/>
        <tableStyleElement type="firstRowSubheading" dxfId="10"/>
        <tableStyleElement type="secondRowSubheading" dxfId="9"/>
        <tableStyleElement type="pageFieldLabels" dxfId="8"/>
        <tableStyleElement type="pageFieldValues" dxfId="7"/>
      </tableStyle>
    </tableStyles>
    <extLst>
      <ext uri="{EB79DEF2-80B8-43e5-95BD-54CBDDF9020C}"
        xmlns:x14="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main">
        <x14:slicerStyles defaultSlicerStyle="SlicerStyleLight1"/>
      </ext>
    </extLst>
  </styleSheet>`;
  return result;
}

export async function exportToXLSX(fileName: string, controller: IController) {
  const JSZip = (await import('jszip')).default;

  const modelJson = controller.toJSON();
  const currentSheetId = controller.getCurrentSheetId();
  const sheetList = modelJson.workbook;

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
  const contentType = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/custom.xml" ContentType="application/vnd.openxmlformats-officedocument.custom-properties+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/xl/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  ${sheetList
    .map(
      (item) =>
        `<Override PartName="/xl/worksheets/${
          sheetRelMap[item.sheetId]!.target
        }" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
    )
    .join('')}
</Types>`;
  zip.file('[Content_Types].xml', contentType);

  const rel = zip.folder('_rels')!;
  const relData = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties" Target="docProps/custom.xml"/>
</Relationships>`;
  rel.file('.rels', relData);

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
  const createDate = new Date().toLocaleDateString('zh').replaceAll('/', '-');
  const createTime = new Date().toLocaleTimeString('zh');
  docProps.file(
    'core.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:dcterms="http://purl.org/dc/terms/"
  xmlns:dcmitype="http://purl.org/dc/dcmitype/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:creator>Steve Xu</dc:creator>
  <cp:lastModifiedBy>Steve Xu</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${createDate}T${createTime}Z</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${createDate}T${createTime}Z</dcterms:modified>
</cp:coreProperties>`,
  );
  docProps.file(
    'custom.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/custom-properties"
  xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="2" name="ICV">
    <vt:lpwstr>A43D6FDBA27248266CF32D6511460B89_41</vt:lpwstr>
  </property>
  <property fmtid="{D5CDD505-2E9C-101B-9397-08002B2CF9AE}" pid="3" name="KSOProductBuildVer">
    <vt:lpwstr>1033-6.2.1.8344</vt:lpwstr>
  </property>
</Properties>`,
  );

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
  const themeData = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="WPS">
  <a:themeElements>
    <a:clrScheme name="WPS">
      <a:dk1>
        <a:sysClr val="windowText" lastClr="000000"/>
      </a:dk1>
      <a:lt1>
        <a:sysClr val="window" lastClr="FFFFFF"/>
      </a:lt1>
      <a:dk2>
        <a:srgbClr val="44546A"/>
      </a:dk2>
      <a:lt2>
        <a:srgbClr val="E7E6E6"/>
      </a:lt2>
      <a:accent1>
        <a:srgbClr val="4874CB"/>
      </a:accent1>
      <a:accent2>
        <a:srgbClr val="EE822F"/>
      </a:accent2>
      <a:accent3>
        <a:srgbClr val="F2BA02"/>
      </a:accent3>
      <a:accent4>
        <a:srgbClr val="75BD42"/>
      </a:accent4>
      <a:accent5>
        <a:srgbClr val="30C0B4"/>
      </a:accent5>
      <a:accent6>
        <a:srgbClr val="E54C5E"/>
      </a:accent6>
      <a:hlink>
        <a:srgbClr val="0026E5"/>
      </a:hlink>
      <a:folHlink>
        <a:srgbClr val="7E1FAD"/>
      </a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="WPS">
      <a:majorFont>
        <a:latin typeface="Calibri Light"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
        <a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>
        <a:font script="Hang" typeface="맑은 고딕"/>
        <a:font script="Hans" typeface="宋体"/>
        <a:font script="Hant" typeface="新細明體"/>
        <a:font script="Arab" typeface="Times New Roman"/>
        <a:font script="Hebr" typeface="Times New Roman"/>
        <a:font script="Thai" typeface="Tahoma"/>
        <a:font script="Ethi" typeface="Nyala"/>
        <a:font script="Beng" typeface="Vrinda"/>
        <a:font script="Gujr" typeface="Shruti"/>
        <a:font script="Khmr" typeface="MoolBoran"/>
        <a:font script="Knda" typeface="Tunga"/>
        <a:font script="Guru" typeface="Raavi"/>
        <a:font script="Cans" typeface="Euphemia"/>
        <a:font script="Cher" typeface="Plantagenet Cherokee"/>
        <a:font script="Yiii" typeface="Microsoft Yi Baiti"/>
        <a:font script="Tibt" typeface="Microsoft Himalaya"/>
        <a:font script="Thaa" typeface="MV Boli"/>
        <a:font script="Deva" typeface="Mangal"/>
        <a:font script="Telu" typeface="Gautami"/>
        <a:font script="Taml" typeface="Latha"/>
        <a:font script="Syrc" typeface="Estrangelo Edessa"/>
        <a:font script="Orya" typeface="Kalinga"/>
        <a:font script="Mlym" typeface="Kartika"/>
        <a:font script="Laoo" typeface="DokChampa"/>
        <a:font script="Sinh" typeface="Iskoola Pota"/>
        <a:font script="Mong" typeface="Mongolian Baiti"/>
        <a:font script="Viet" typeface="Times New Roman"/>
        <a:font script="Uigh" typeface="Microsoft Uighur"/>
        <a:font script="Geor" typeface="Sylfaen"/>
      </a:majorFont>
      <a:minorFont>
        <a:latin typeface="Calibri"/>
        <a:ea typeface=""/>
        <a:cs typeface=""/>
        <a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>
        <a:font script="Hang" typeface="맑은 고딕"/>
        <a:font script="Hans" typeface="宋体"/>
        <a:font script="Hant" typeface="新細明體"/>
        <a:font script="Arab" typeface="Arial"/>
        <a:font script="Hebr" typeface="Arial"/>
        <a:font script="Thai" typeface="Tahoma"/>
        <a:font script="Ethi" typeface="Nyala"/>
        <a:font script="Beng" typeface="Vrinda"/>
        <a:font script="Gujr" typeface="Shruti"/>
        <a:font script="Khmr" typeface="DaunPenh"/>
        <a:font script="Knda" typeface="Tunga"/>
        <a:font script="Guru" typeface="Raavi"/>
        <a:font script="Cans" typeface="Euphemia"/>
        <a:font script="Cher" typeface="Plantagenet Cherokee"/>
        <a:font script="Yiii" typeface="Microsoft Yi Baiti"/>
        <a:font script="Tibt" typeface="Microsoft Himalaya"/>
        <a:font script="Thaa" typeface="MV Boli"/>
        <a:font script="Deva" typeface="Mangal"/>
        <a:font script="Telu" typeface="Gautami"/>
        <a:font script="Taml" typeface="Latha"/>
        <a:font script="Syrc" typeface="Estrangelo Edessa"/>
        <a:font script="Orya" typeface="Kalinga"/>
        <a:font script="Mlym" typeface="Kartika"/>
        <a:font script="Laoo" typeface="DokChampa"/>
        <a:font script="Sinh" typeface="Iskoola Pota"/>
        <a:font script="Mong" typeface="Mongolian Baiti"/>
        <a:font script="Viet" typeface="Arial"/>
        <a:font script="Uigh" typeface="Microsoft Uighur"/>
        <a:font script="Geor" typeface="Sylfaen"/>
      </a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="WPS">
      <a:fillStyleLst>
        <a:solidFill>
          <a:schemeClr val="phClr"/>
        </a:solidFill>
        <a:gradFill>
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:lumOff val="17500"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr"/>
            </a:gs>
          </a:gsLst>
          <a:lin ang="2700000" scaled="0"/>
        </a:gradFill>
        <a:gradFill>
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:hueOff val="-2520000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr"/>
            </a:gs>
          </a:gsLst>
          <a:lin ang="2700000" scaled="0"/>
        </a:gradFill>
      </a:fillStyleLst>
      <a:lnStyleLst>
        <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:prstDash val="solid"/>
          <a:miter lim="800000"/>
        </a:ln>
        <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
          <a:solidFill>
            <a:schemeClr val="phClr"/>
          </a:solidFill>
          <a:prstDash val="solid"/>
          <a:miter lim="800000"/>
        </a:ln>
        <a:ln w="12700" cap="flat" cmpd="sng" algn="ctr">
          <a:gradFill>
            <a:gsLst>
              <a:gs pos="0">
                <a:schemeClr val="phClr">
                  <a:hueOff val="-4200000"/>
                </a:schemeClr>
              </a:gs>
              <a:gs pos="100000">
                <a:schemeClr val="phClr"/>
              </a:gs>
            </a:gsLst>
            <a:lin ang="2700000" scaled="1"/>
          </a:gradFill>
          <a:prstDash val="solid"/>
          <a:miter lim="800000"/>
        </a:ln>
      </a:lnStyleLst>
      <a:effectStyleLst>
        <a:effectStyle>
          <a:effectLst>
            <a:outerShdw blurRad="101600" dist="50800" dir="5400000" algn="ctr" rotWithShape="0">
              <a:schemeClr val="phClr">
                <a:alpha val="60000"/>
              </a:schemeClr>
            </a:outerShdw>
          </a:effectLst>
        </a:effectStyle>
        <a:effectStyle>
          <a:effectLst>
            <a:reflection stA="50000" endA="300" endPos="40000" dist="25400" dir="5400000" sy="-100000" algn="bl" rotWithShape="0"/>
          </a:effectLst>
        </a:effectStyle>
        <a:effectStyle>
          <a:effectLst>
            <a:outerShdw blurRad="57150" dist="19050" dir="5400000" algn="ctr" rotWithShape="0">
              <a:srgbClr val="000000">
                <a:alpha val="63000"/>
              </a:srgbClr>
            </a:outerShdw>
          </a:effectLst>
        </a:effectStyle>
      </a:effectStyleLst>
      <a:bgFillStyleLst>
        <a:solidFill>
          <a:schemeClr val="phClr"/>
        </a:solidFill>
        <a:solidFill>
          <a:schemeClr val="phClr">
            <a:tint val="95000"/>
            <a:satMod val="170000"/>
          </a:schemeClr>
        </a:solidFill>
        <a:gradFill rotWithShape="1">
          <a:gsLst>
            <a:gs pos="0">
              <a:schemeClr val="phClr">
                <a:tint val="93000"/>
                <a:satMod val="150000"/>
                <a:shade val="98000"/>
                <a:lumMod val="102000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="50000">
              <a:schemeClr val="phClr">
                <a:tint val="98000"/>
                <a:satMod val="130000"/>
                <a:shade val="90000"/>
                <a:lumMod val="103000"/>
              </a:schemeClr>
            </a:gs>
            <a:gs pos="100000">
              <a:schemeClr val="phClr">
                <a:shade val="63000"/>
                <a:satMod val="120000"/>
              </a:schemeClr>
            </a:gs>
          </a:gsLst>
          <a:lin ang="5400000" scaled="0"/>
        </a:gradFill>
      </a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
  <a:objectDefaults/>
</a:theme>`;
  theme.file('theme1.xml', themeData);

  const worksheets = xl.folder('worksheets')!;
  for (const item of sheetList) {
    const { activeCell } = item;
    const t = sheetRelMap[item.sheetId];
    const cellData = modelJson.worksheets[item.sheetId];
    const isActiveSheet = item.sheetId === currentSheetId;
    const customWidth = modelJson.customWidth[item.sheetId];
    if (!cellData) {
      worksheets.file(
        t.target,
        getSheetData(activeCell, '', isActiveSheet, customWidth),
      );
      continue;
    }
    const rowList: string[] = [];
    for (const row of Object.keys(cellData)) {
      const r = cellData[row];
      const colList: string[] = [];
      const realR = parseInt(row, 10);
      if (!isEmpty(r)) {
        for (const c of Object.keys(r)) {
          const v = r[c];
          const ref = convertToReference({
            row: realR,
            col: parseInt(c, 10),
            rowCount: 1,
            colCount: 1,
            sheetId: '',
          });
          const f = v.formula ? `<f>${v.formula.slice(1)}</f>` : '';
          const val = f ? '' : `<v>${v.value || ''}</v>`;
          let s = '';
          if (v.style && !isEmpty(v.style)) {
            s = `s="${styles.cellXfs.length}"`;
            convertStyle(styles, v.style);
          }
          colList.push(`<c r="${ref}" ${s}>
          ${f}
          ${val}
        </c>`);
        }
      }
      const customHeight = modelJson.customHeight?.[item.sheetId]?.[row];
      let ht = '';
      if (customHeight) {
        ht = `ht="${customHeight.widthOrHeight}" customHeight="1" ${
          customHeight.isHide ? 'hidden="1"' : ''
        }`;
      }
      rowList.push(`<row r="${realR + 1}" ${ht}>${colList.join('')}</row>`);
    }
    worksheets.file(
      t.target,
      getSheetData(activeCell, rowList.join(''), isActiveSheet, customWidth),
    );
  }

  xl.file('styles.xml', generateStyleFile(styles));

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, fileName);
}
