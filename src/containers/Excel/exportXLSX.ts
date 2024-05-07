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
  convertColorToHex,
  getCustomWidthOrHeightKey,
  extractImageType,
  widthOrHeightKeyToData,
  NUMBER_FORMAT_LIST,
} from '@/util';
import { XfItem, chartTypeList, convertToPt } from './importXLSX';
import { numberFormat } from '@/model'
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
      `<font>\n${fontList.join(
        '\n',
      )}\n<charset val="0"/>\n<scheme val="minor"/>\n</font>`,
    );
  }

  if (style.numberFormat) {
    const item = NUMBER_FORMAT_LIST.find(v => v.formatCode === style.numberFormat);
    if (item) {
      extraList.push('applyNumberFormat="1"');
      result.numFmtId = String(item.id);
    }
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
        [EVerticalAlign.MIDDLE]: 'center',
        [EVerticalAlign.BOTTOM]: 'bottom',
      };
      if (style.verticalAlign !== EVerticalAlign.BOTTOM) {
        list.push(`vertical="${alignMap[style.verticalAlign]}"`);
      }
    }
    if (list.length > 0) {
      alignment = `<alignment ${list.join(' ')}/>`;
    }
  }

  const t = `<xf numFmtId="${result.numFmtId}" fontId="${result.fontId
    }" fillId="${result.fillId}" borderId="0" xfId="0" ${extraList.join(
      ' ',
    )}>\n${alignment}\n</xf>`;
  styles.cellXfs.push(t);
}
function compileTemplate(template: string, target: Partial<CommonData> = {}) {
  const result = template.replace(/{([a-z]+)}/gi, function (_, key) {
    if (key in target) {
      // @ts-ignore
      return target[key];
    }
    throw new Error(`compileTemplate not found key: "${key}"`);
  });
  return result;
}

function convertSheetName(name: string) {
  return name.includes(' ') ? `'${name}'` : name;
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
  currentSheetId: string,
) {
  const list: string[] = [];
  for (const [key, value] of Object.entries(customWidthMap)) {
    const { sheetId, rowOrCol: col } = widthOrHeightKeyToData(key);
    if (currentSheetId !== sheetId || !value) {
      continue;
    }
    const t = col + 1;
    const w = convertToPt(value.len);
    list.push(
      `<col min="${t}" max="${t}" width="${w}" customWidth="1" ${value.isHide ? 'hidden="1"' : ''
      }/>`,
    );
  }
  if (list.length === 0) {
    return '';
  }
  return `<cols>${list.join('')}</cols>`;
}

function buildStyle(style: StyleData) {
  const list: string[] = [];
  const result: Array<[string, string[]]> = Object.entries(style);
  result.sort((a, b) => (a[0] > b[0] ? -1 : 1));
  for (const [key, value] of result) {
    if (value.length > 0) {
      list.push(
        `<${key} count="${value.length}">\n${value.join('\n')}\n</${key}>`,
      );
    }
  }
  return list.join('\n');
}

export function convertToXMLData(controller: IController) {
  const model = controller.toJSON();
  const sheetList = Object.values(model.workbook);
  sheetList.sort((a, b) => a.sort - b.sort);
  const contentTypeList: string[] = [];
  const sheetRelMap: Record<
    string,
    { rid: string; target: string; name: string }
  > = {};
  for (let i = 0;i < sheetList.length;i++) {
    const t = sheetList[i];
    const a = i + 1;
    sheetRelMap[t.sheetId] = {
      rid: `rId${a}`,
      target: `sheet${a}.xml`,
      name: t.name,
    };
    contentTypeList.push(
      `<Override PartName="/xl/worksheets/sheet${a}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
    );
  }

  const convertSheetIdToSheetName = (sheetId: string) => {
    const id = sheetId || model.currentSheetId;
    const name = sheetList.find((v) => v.sheetId === id)?.name || '';
    return convertSheetName(name);
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
  if (Object.keys(model.drawings).length > 0) {
    const drawings = Object.values(model.drawings);
    let index = 1;
    for (const item of sheetList) {
      const list = drawings.filter((v) => v.sheetId === item.sheetId);
      if (list.length === 0) {
        continue;
      }
      const sheetInfo = sheetRelMap[item.sheetId];
      const fileName = `drawing${index}.xml`;
      result[`xl/worksheets/_rels/${sheetInfo.target}.rels`] = compileTemplate(
        CONFIG['xl/worksheets/_rels/sheet1.xml.rels'],
        { children: fileName },
      );
      let rid = 1;
      let chartIndex = 1;
      let imageIndex = 1;
      const relationList: string[] = [];
      const drawingData: string[] = [];
      for (const drawing of list) {
        let endCol = drawing.fromCol;
        let endRow = drawing.fromRow;
        for (let i = 0;i < drawing.width;i++) {
          i += controller.getColWidth(endCol++).len;
        }
        for (let i = 0;i < drawing.height;i++) {
          i += controller.getRowHeight(endRow++).len;
        }
        const position = `<xdr:from>
        <xdr:col>${drawing.fromCol}</xdr:col>
        <xdr:colOff>304800</xdr:colOff>
        <xdr:row>${drawing.fromRow}</xdr:row>
        <xdr:rowOff>165100</xdr:rowOff>
      </xdr:from>
      <xdr:to>
        <xdr:col>${endCol}</xdr:col>
        <xdr:colOff>457200</xdr:colOff>
        <xdr:row>${endRow}</xdr:row>
        <xdr:rowOff>63500</xdr:rowOff>
      </xdr:to>`;
        if (drawing.type === 'chart') {
          relationList.push(
            `<Relationship Id="rId${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart" Target="../charts/chart${chartIndex}.xml"/>`,
          );
          result[`xl/charts/_rels/chart${chartIndex}.xml.rels`] =
            compileTemplate(CONFIG['xl/charts/_rels/chart1.xml.rels'], {
              children: String(chartIndex),
            });
          result[`xl/charts/colors${chartIndex}.xml`] =
            CONFIG['xl/charts/colors1.xml'];
          result[`xl/charts/style${chartIndex}.xml`] =
            CONFIG['xl/charts/style1.xml'];
          contentTypeList.push(
            `<Override PartName="/xl/charts/chart${chartIndex}.xml" ContentType="application/vnd.openxmlformats-officedocument.drawingml.chart+xml"/>`,
          );
          contentTypeList.push(
            `<Override PartName="/xl/charts/colors${chartIndex}.xml" ContentType="application/vnd.ms-office.chartcolorstyle+xml"/>`,
          );
          contentTypeList.push(
            `<Override PartName="/xl/charts/style${chartIndex}.xml" ContentType="application/vnd.ms-office.chartstyle+xml"/>`,
          );
          const children: string[] = [];
          const range = drawing.chartRange!;
          for (let i = 0;i < range.colCount;i++) {
            const start = convertToReference(
              {
                row: range.row,
                col: range.col + i,
                rowCount: 1,
                colCount: 1,
                sheetId: '',
              },
              'absolute',
            );
            const end = convertToReference(
              {
                row: range.row + range.rowCount - 1,
                col: range.col + i,
                rowCount: 1,
                colCount: 1,
                sheetId: '',
              },
              'absolute',
            );
            children.push(` <c:ser>
            <c:idx val="${chartIndex}"/>
            <c:order val="${chartIndex}"/>
            <c:spPr>
              <a:solidFill>
                <a:schemeClr val="accent${chartIndex}"/>
              </a:solidFill>
              <a:ln>
                <a:noFill/>
              </a:ln>
              <a:effectLst/>
            </c:spPr>
            <c:invertIfNegative val="0"/>
            <c:dLbls>
              <c:delete val="1"/>
            </c:dLbls>
            <c:val>
              <c:numRef>
                <c:f>${convertSheetIdToSheetName(
              range.sheetId,
            )}!${start}:${end}</c:f>
                <c:numCache>
                  <c:formatCode>General</c:formatCode>
                  <c:ptCount val="${range.rowCount}"/>
                </c:numCache>
              </c:numRef>
            </c:val>
          </c:ser>`);
          }
          result[`xl/charts/chart${chartIndex}.xml`] = compileTemplate(
            CONFIG['xl/charts/chart1.xml'],
            {
              size: drawing.title,
              children: children.join('\n'),
              large: chartTypeList.some((v) => v === drawing.chartType!)
                ? drawing.chartType
                : 'bar',
            },
          );

          drawingData.push(`<xdr:twoCellAnchor>
          ${position}
          <xdr:graphicFrame>
            <xdr:nvGraphicFramePr>
              <xdr:cNvPr id="${drawing.uuid}" name="Chart ${rid}"/>
              <xdr:cNvGraphicFramePr/>
            </xdr:nvGraphicFramePr>
            <xdr:xfrm>
              <a:off x="8256270" y="1445260"/>
              <a:ext cx="4541520" cy="2885440"/>
            </xdr:xfrm>
            <a:graphic>
              <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
                <c:chart xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart"
                  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="rId${rid}"/>
              </a:graphicData>
            </a:graphic>
          </xdr:graphicFrame>
          <xdr:clientData/>
        </xdr:twoCellAnchor>`);
        } else if (drawing.type === 'floating-picture') {
          const data = extractImageType(drawing.imageSrc!);
          contentTypeList.unshift(
            `<Default Extension="${data.ext.slice(1)}" ContentType="${data.type
            }"/>`,
          );
          const imageName = `image${imageIndex}${data.ext}`;

          relationList.push(
            `<Relationship Id="rId${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/${imageName}"/>`,
          );
          result[`xl/media/${imageName}`] = data.base64;
          drawingData.push(`<xdr:twoCellAnchor editAs="oneCell">
          ${position}
          <xdr:pic>
            <xdr:nvPicPr>
              <xdr:cNvPr id="${drawing.uuid}" name="Picture ${rid}" descr="face"/>
              <xdr:cNvPicPr>
                <a:picLocks noChangeAspect="1"/>
              </xdr:cNvPicPr>
            </xdr:nvPicPr>
            <xdr:blipFill>
              <a:blip r:embed="rId${rid}"/>
              <a:stretch>
                <a:fillRect/>
              </a:stretch>
            </xdr:blipFill>
            <xdr:spPr>
              <a:xfrm>
                <a:off x="744220" y="4693920"/>
                <a:ext cx="4770120" cy="5057140"/>
              </a:xfrm>
              <a:prstGeom prst="rect">
                <a:avLst/>
              </a:prstGeom>
            </xdr:spPr>
          </xdr:pic>
          <xdr:clientData/>
        </xdr:twoCellAnchor>`);
        }
        rid++;
        imageIndex++;
        chartIndex++;
      }
      result[`xl/drawings/${fileName}`] = compileTemplate(
        CONFIG['xl/drawings/drawing1.xml'],
        { children: drawingData.join('\n') },
      );
      contentTypeList.push(
        `<Override PartName="/xl/drawings/${fileName}" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>`,
      );
      result[`xl/drawings/_rels/${fileName}.rels`] = compileTemplate(
        CONFIG['xl/drawings/_rels/drawing1.xml.rels'],
        { children: relationList.join('\n') },
      );
      index++;
    }
  }
  result['xl/theme/theme1.xml'] = CONFIG['xl/theme/theme1.xml'];

  result['xl/workbook.xml'] = compileTemplate(CONFIG['xl/workbook.xml'], {
    size: activeIndex >= 0 ? ` activeTab="${activeIndex}" ` : '',
    large:
      defineNames.length > 0
        ? `<definedNames>\n${defineNames.join('\n')}\n</definedNames>`
        : '',
    children: sheetList
      .map((v) => {
        const item = sheetRelMap[v.sheetId];
        return `<sheet name="${v.name}" sheetId="${v.sheetId}" r:id="${item.rid}"/>`;
      })
      .join('\n'),
  });
  result['[Content_Types].xml'] = compileTemplate(
    CONFIG['[Content_Types].xml'],
    {
      children: contentTypeList.join('\n'),
    },
  );
  const styles: StyleData = {
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
    cellXfs: [
      `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0">
    <alignment vertical="center"/>
  </xf>`,
    ],
  };
  for (const item of sheetList) {
    const mergeCells = Object.values(model.mergeCells)
      .filter((v) => v.sheetId === item.sheetId)
      .map((v) => {
        const ref = convertToReference({
          ...v,
          sheetId: '',
        });
        return `<mergeCell ref="${ref}"/>`;
      });

    const v = sheetRelMap[item.sheetId];
    const range = model.rangeMap[item.sheetId] || {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    };
    range.sheetId = '';
    const cellData = model.worksheets[item.sheetId] || {};
    const targetData: Partial<CommonData> = {
      children: '<sheetData/>',
      size: getCustomWidth(model.customWidth, item.sheetId),
      large: `<sheetView ${item.sheetId === model.currentSheetId ? 'tabSelected="1"' : ''
        } workbookViewId="0">
    <selection activeCell="${convertToReference({
          ...range,
          rowCount: 1,
          colCount: 1,
        })}" sqref="${convertToReference(range)}"/>
  </sheetView>`,
    };
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
      const val = `<v>${numberFormat(v.value, v.style?.numberFormat)}</v>`;
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
        ht = `ht="${customHeight.len}" customHeight="1" ${customHeight.isHide ? 'hidden="1"' : ''
          }`;
      }
      const cols = rowMap.get(row)!;
      rowList.push(
        `<row r="${row + 1}" ${ht} x14ac:dyDescent="0.4">\n${cols.join(
          '\n',
        )}\n</row>`,
      );
    }
    if (rowList.length > 0) {
      targetData.children = `<sheetData>\n${rowList.join('\n')}\n</sheetData>`;
    }
    if (mergeCells.length > 0) {
      targetData.children += `<mergeCells count="${mergeCells.length
        }">\n${mergeCells.join('\n')}\n</mergeCells>`;
    }

    result[`xl/worksheets/${v.target}`] = compileTemplate(
      CONFIG['xl/worksheets/sheet1.xml'],
      targetData,
    );
  }
  result['xl/styles.xml'] = compileTemplate(CONFIG['xl/styles.xml'], {
    children: buildStyle(styles),
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
    for (let i = 0;i < list.length;i++) {
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

    let folder = zip;
    if (list.length > 0) {
      folder = folderMap.get(list.join(SPLITTER))!;
    }
    if (key.startsWith('xl/media')) {
      folder.file(fileName, value, { base64: true });
    } else {
      const realValue = value
        .trim()
        .split('/n')
        .map((v) => v.trim())
        .filter((v) => v)
        .join('');
      folder.file(fileName, realValue);
    }
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, fileName);
}
