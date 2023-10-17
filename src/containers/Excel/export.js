import { xmlData } from './mock';
import { saveAs } from 'file-saver';
import { convertToReference } from '@/util';
function processRow(row) {
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
        if (result.search(/("|,|\n)/g) >= 0)
            result = '"' + result + '"';
        if (j > 0)
            finalVal += ',';
        finalVal += result;
    }
    return finalVal + '\n';
}
export function exportToCsv(fileName, rows) {
    let csvFile = '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }
    const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, fileName);
}
function getSheetData(activeCell, sheetData) {
    const v = sheetData ? `<sheetData>
  ${sheetData}
</sheetData>` : '<sheetData/>';
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
export async function exportToXLSX(fileName, controller) {
    const JSZip = (await import('jszip')).default;
    const sheetList = controller.getSheetList();
    const zip = new JSZip();
    zip.file('[Content_Types].xml', xmlData['[Content_Types].xml']);
    const rel = zip.folder('_rels');
    rel.file('.rels', xmlData['_rels/.rels']);
    const xl = zip.folder('xl');
    xl.file('styles.xml', xmlData['xl/styles.xml']);
    const sheetRelMap = {};
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
        .map((item) => `<sheet name="${item.name}" sheetId="${item.sheetId}" r:id="${sheetRelMap[item.sheetId].rid}"/>`)
        .join('')}
      <sheet name="Sheet1" sheetId="1" r:id="rId1"/>
    </sheets>
    <calcPr calcId="144525"/>
  </workbook>`;
    xl.file('workbook.xml', workbook);
    const xlRel = xl.folder('_rels');
    const workbookRel = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
  <Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId${sheetList.length + 2}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
    <Relationship Id="rId${sheetList.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="theme/theme1.xml"/>
    ${sheetList
        .map((item) => {
        const t = sheetRelMap[item.sheetId];
        return `<Relationship Id="${t.rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/${t.target}"/>`;
    })
        .reverse()
        .join('')}
  </Relationships>`;
    xlRel.file('workbook.xml.rels', workbookRel);
    const theme = xl.folder('theme');
    theme.file('theme1.xml', xmlData['xl/theme/theme1.xml']);
    const worksheets = xl.folder('worksheets');
    for (const item of sheetList) {
        const { activeCell } = item;
        const t = sheetRelMap[item.sheetId];
        const cellData = controller.getSheetData(item.sheetId);
        if (!cellData) {
            worksheets.file(t.target, getSheetData(activeCell, ''));
            continue;
        }
        const rowList = [];
        for (const row of Object.keys(cellData)) {
            const r = cellData[row];
            const colList = [];
            const realR = parseInt(row, 10);
            if (r) {
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
                    colList.push(`<c r="${ref}">
          ${f}
          ${val}
        </c>`);
                }
            }
            rowList.push(`<row r="${realR + 1}">${colList.join('')}</row>`);
        }
        worksheets.file(t.target, getSheetData(activeCell, rowList.join('')));
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, fileName);
}
//# sourceMappingURL=export.js.map