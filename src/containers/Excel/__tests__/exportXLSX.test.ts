import { convertToXMLData } from '../exportXLSX';
import { initController } from '@/controller';

function trimData(content: string) {
  return content
    .split('\n')
    .map((v) => v.trim())
    .filter((v) => v);
}

describe('exportXLSX.test.ts', () => {
  describe('convertToXMLData', () => {
    test('normal', () => {
      const controller = initController();
      controller.setCellValues(
        [
          [true, false, 'true', 'false', 'ab'],
          ['=SUM(1,SUM(1,3))', 5, 6, '测', '永1'],
        ],
        [],
        [{ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }],
      );
      const result = convertToXMLData(controller);
      expect(trimData(result['xl/worksheets/sheet1.xml'])).toEqual(
        trimData(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
          xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
          xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" mc:Ignorable="x14ac xr xr2 xr3"
          xmlns:x14ac="http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac"
          xmlns:xr="http://schemas.microsoft.com/office/spreadsheetml/2014/revision"
          xmlns:xr2="http://schemas.microsoft.com/office/spreadsheetml/2015/revision2"
          xmlns:xr3="http://schemas.microsoft.com/office/spreadsheetml/2016/revision3" xr:uid="{9B2CBB7B-9BFB-4EF9-A18C-0B0DED5460D3}">
          <dimension ref="A1:D5"/>
          <sheetViews>
            <sheetView tabSelected="1" workbookViewId="0">
            <selection activeCell="A1" sqref="A1"/>
            </sheetView>
          </sheetViews>
          <sheetFormatPr defaultRowHeight="13.9" x14ac:dyDescent="0.4"/>
          <cols>

          </cols>
          <sheetData>
            <row r="1" >
              <c r="A1" ><v>TRUE</v></c>
              <c r="B1" ><v>FALSE</v></c>
              <c r="C1" ><v>TRUE</v></c>
              <c r="D1" ><v>FALSE</v></c>
              <c r="E1" ><v>ab</v></c>
            </row>
            <row r="2" >
              <c r="A2" ><f>=SUM(1,SUM(1,3))</f><v>5</v></c>
              <c r="B2" ><v>5</v></c>
              <c r="C2" ><v>6</v></c>
              <c r="D2" ><v>测</v></c>
              <c r="E2" ><v>永1</v></c>
            </row>
          </sheetData>
          <phoneticPr fontId="2" type="noConversion"/>
          <pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/>
        </worksheet>`),
      );
    });
  });
});
