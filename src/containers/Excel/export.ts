import { xmlData } from './mock';
import { saveAs } from 'file-saver';
import {
  IController,
  IRange,
  ResultType,
  StyleType,
  EUnderLine,
  EHorizontalAlign,
  EVerticalAlign,
} from '@/types';
import { convertToReference, isEmpty, NUMBER_FORMAT_LIST } from '@/util';
import { XfItem } from './import';
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
    if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
    if (j > 0) finalVal += ',';
    finalVal += result;
  }
  return finalVal + '\n';
}
export function exportToCsv(fileName: string, rows: ResultType[][]) {
  let csvFile = '';
  for (var i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
}

function getSheetData(activeCell: IRange, sheetData: string) {
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
        <sheetView tabSelected="1" workbookViewId="0">
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
      ${v}
      <pageMargins left="0.75" right="0.75" top="1" bottom="1" header="0.5" footer="0.5"/>
      <headerFooter/>
    </worksheet>`;
  return result;
}

// TODO: convert color to rgb
function convertColorToRGB(val: string) {
  const t = convertColorToHex(val);
  return t.slice(1, -2);
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

  const sheetList = controller.getSheetList();

  const zip = new JSZip();
  zip.file('[Content_Types].xml', xmlData['[Content_Types].xml']);

  const rel = zip.folder('_rels')!;
  rel.file('.rels', xmlData['_rels/.rels']);

  // const docProps = zip.folder('docProps')!;
  // docProps.file('app.xml', '');
  // docProps.file('core.xml', '');
  // docProps.file('custom.xml', '');

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

  const sheetRelMap: Record<string, { rid: string; target: string }> = {};
  for (let i = 0; i < sheetList.length; i++) {
    const t = sheetList[i];
    const a = i + 1;
    sheetRelMap[t.sheetId] = {
      rid: `rId${a}`,
      target: `sheet${a}.xml`,
    };
  }

  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
    xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
    <fileVersion appName="xl" lastEdited="3" lowestEdited="5" rupBuild="9302"/>
    <workbookPr/>
    <bookViews>
      <workbookView windowWidth="28800" windowHeight="11340"/>
    </bookViews>
    <sheets>
      ${sheetList
        .map(
          (item) =>
            `<sheet name="${item.name}" sheetId="${item.sheetId}" r:id="${
              sheetRelMap[item.sheetId]!.rid
            }"/>`,
        )
        .join('')}
      <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
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
  theme.file('theme1.xml', xmlData['xl/theme/theme1.xml']);

  const worksheets = xl.folder('worksheets')!;
  for (const item of sheetList) {
    const { activeCell } = item;
    const t = sheetRelMap[item.sheetId];
    const cellData = controller.getSheetData(item.sheetId);
    if (!cellData) {
      worksheets.file(t.target, getSheetData(activeCell, ''));
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
      rowList.push(`<row r="${realR + 1}">${colList.join('')}</row>`);
    }
    worksheets.file(t.target, getSheetData(activeCell, rowList.join('')));
  }

  xl.file('styles.xml', generateStyleFile(styles));

  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, fileName);
}