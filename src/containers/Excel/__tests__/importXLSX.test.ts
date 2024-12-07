import { convertXMLToJSON, importXLSX } from '../importXLSX';
import { ModelJSON, EVerticalAlign, EUnderLine } from '../../../types';
import fs from 'fs/promises';
import path from 'path';
import { initController, getMockHooks } from '../../../controller';

describe('importXLSX.test.ts', () => {
  describe('convertColorToHex', () => {
    test('normal', () => {
      expect(
        convertXMLToJSON(`
          <tile>
            <logo src="./ms-icon-70x70.png"/>
            <logo src="./ms-icon.png"/>
            <TileColor>#ffffff</TileColor>
          </tile>`),
      ).toEqual({
        tile: {
          logo: [{ src: './ms-icon-70x70.png' }, { src: './ms-icon.png' }],
          TileColor: { '#text': '#ffffff' },
        },
      });
    });
  });
  describe('importXLSX', () => {
    test('normal', async () => {
      const filePath = path.join(process.cwd(), './scripts/origin.xlsx');
      const fileData = await fs.readFile(filePath);
      const model = await importXLSX(fileData as any);
      const controller = initController(getMockHooks());
      controller.addSheet();
      controller.fromJSON(model);
      const result: ModelJSON = {
        scroll: {},
        autoFilter: {},
        rangeMap: {
          '2': { row: 0, col: 2, rowCount: 1, colCount: 1, sheetId: '2' },
          '3': { row: 9, col: 8, rowCount: 2, colCount: 1, sheetId: '3' },
          '4': { row: 19, col: 9, rowCount: 1, colCount: 1, sheetId: '4' },
          '5': { row: 27, col: 5, rowCount: 1, colCount: 1, sheetId: '5' },
          '6': {
            col: 6,
            colCount: 1,
            row: 5,
            rowCount: 1,
            sheetId: '6',
          },
        },
        workbook: {
          '2': {
            sheetId: '2',
            name: 'Sheet2',
            isHide: false,
            rowCount: 200,
            colCount: 200,
            sort: 1,
            tabColor: '#FFC000',
          },
          '3': {
            sheetId: '3',
            name: 'Sheet3',
            isHide: false,
            rowCount: 200,
            colCount: 200,
            sort: 2,
            tabColor: undefined,
          },
          '4': {
            sheetId: '4',
            name: 'Sheet4',
            isHide: false,
            rowCount: 200,
            colCount: 200,
            sort: 3,
            tabColor: undefined,
          },
          '5': {
            sheetId: '5',
            name: 'Sheet1',
            isHide: false,
            rowCount: 200,
            colCount: 200,
            sort: 0,
            tabColor: '#ED7D31',
          },
          '6': {
            colCount: 200,
            isHide: false,
            name: 'Sheet5',
            rowCount: 200,
            sheetId: '6',
            sort: 4,
            tabColor: '#70AD47',
          },
        },
        mergeCells: {
          'Sheet5!$B$2:$C$3': {
            col: 1,
            colCount: 2,
            row: 1,
            rowCount: 2,
            sheetId: '6',
          },
          'Sheet5!$F$7:$G$8': {
            col: 5,
            colCount: 2,
            row: 6,
            rowCount: 2,
            sheetId: '6',
          },
        },
        customHeight: {},
        customWidth: {
          '2_1': { len: 149, isHide: false },
          '2_3': { len: 350, isHide: false },
        },
        definedNames: {},
        currentSheetId: '6',
        drawings: {
          '1': {
            title: 'Picture 2',
            type: 'floating-picture',
            uuid: '1',
            width: 300,
            height: 300,
            originHeight: 300,
            originWidth: 300,
            fromCol: 8,
            fromRow: 5,
            sheetId: '3',
            marginX: 0,
            marginY: 0,
            imageAngle: 0,
            imageSrc:
              'data:image/jpeg;base64,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',
          },
          '2': {
            title: 'test',
            type: 'chart',
            uuid: '2',
            width: 300,
            height: 300,
            originHeight: 300,
            originWidth: 300,
            fromCol: 3,
            fromRow: 6,
            sheetId: '4',
            marginX: 0,
            marginY: 0,
            chartType: 'bar',
            chartRange: {
              row: 3,
              col: 4,
              rowCount: 1,
              colCount: 2,
              sheetId: '4',
            },
          },
        },

        worksheets: {
          '2_0_0': {
            value: '1a',
            verticalAlign: EVerticalAlign.MIDDLE,
            isWrapText: true,
            fontSize: 11,
            isBold: false,
            isItalic: false,
            isStrike: false,
            underline: EUnderLine.NONE,
            fontFamily: '等线',
            fontColor: '#FF0000',
          },
          '2_0_1': {
            value: '',
            verticalAlign: EVerticalAlign.MIDDLE,
            isWrapText: true,
            fontSize: 26,
            isBold: false,
            isItalic: false,
            isStrike: false,
            underline: EUnderLine.NONE,
            fontFamily: '等线',
            fontColor: '#000000',
          },
          '2_0_2': {
            value: '1a',
            verticalAlign: 1,
            isWrapText: true,
          },
          '2_0_3': {
            value: 'large text',
            verticalAlign: 1,
            isWrapText: true,
            fontSize: 36,
            isBold: false,
            isItalic: false,
            isStrike: false,
            underline: 0,
            fontFamily: '等线',
            fontColor: '#000000',
          },
          '2_1_0': { value: 15, verticalAlign: 1, isWrapText: true },
          '2_1_1': { value: '', verticalAlign: 1, isWrapText: true },
          '2_1_2': { value: '', verticalAlign: 1, isWrapText: true },
          '2_1_3': { value: '', verticalAlign: 1, isWrapText: true },
          '2_2_0': { value: '', verticalAlign: 1, isWrapText: true },
          '2_2_1': { value: '', verticalAlign: 1, isWrapText: true },
          '2_2_2': { value: '', verticalAlign: 1, isWrapText: true },
          '2_2_3': { value: '', verticalAlign: 1, isWrapText: true },
          '2_3_0': {
            value: '',
            verticalAlign: 1,
            isWrapText: true,
            fillColor: '#FF0000',
          },
          '2_3_1': {
            value: '',
            verticalAlign: 1,
            isWrapText: true,
            fillColor: '#FF0000',
          },
          '2_3_2': { value: '', verticalAlign: 1, isWrapText: true },
          '2_3_3': { value: '', verticalAlign: 1, isWrapText: true },
          '2_4_0': {
            value: '',
            verticalAlign: 1,
            isWrapText: true,
            fillColor: '#FF0000',
          },
          '2_4_1': {
            value: '',
            verticalAlign: 1,
            isWrapText: true,
            fillColor: '#FF0000',
          },
          '2_4_2': { value: '', verticalAlign: 1, isWrapText: true },
          '2_4_3': { value: '', verticalAlign: 1, isWrapText: true },
          '4_3_4': { value: 22 },
          '4_6_4': { value: 33 },
          '5_0_0': { value: 1 },
          '5_0_1': { value: 2 },
          '5_0_2': { value: 3, formula: '=SUM(A1,B1)' },
          '5_1_0': {
            value: 12,
            numberFormat: '0.00_);[Red]\\(0.00\\)',
          },
          '5_2_0': {
            value: 13,
            numberFormat: '"￥"#,##0.00_);[Red]\\("￥"#,##0.00\\)',
          },
          '5_3_0': {
            value: 14,
            numberFormat:
              '_ "￥"* #,##0.00_ ;_ "￥"* \\-#,##0.00_ ;_ "￥"* "-"??_ ;_ @_ ',
          },
          '5_4_0': { value: 15, numberFormat: 'yyyy/m/d;@' },
          '5_5_0': {
            value: 16,
            numberFormat: 'yyyy"年"m"月"d"日";@',
          },
          '5_6_0': { value: 17, numberFormat: 'h:mm:ss;@' },
          '5_7_0': { value: 18, numberFormat: '0.00%' },
          '5_8_0': { value: 0.33, numberFormat: '#\\ ?/?' },
          '5_9_0': { value: 20, numberFormat: '0.00E+00' },
          '5_10_0': { value: 21, numberFormat: '@' },
          '5_11_0': { value: 22 },
          '5_12_0': { value: 23 },
          '5_13_0': { value: 24 },
          '5_14_0': { value: 25 },
          '5_15_0': { value: 26 },
          '5_16_0': { value: 27 },
          '6_0_8': {
            value: '',
            borderLeft: { type: 'thin', color: '' },
            borderRight: { type: 'thin', color: '' },
            borderTop: { type: 'thin', color: '' },
            borderBottom: { type: 'thin', color: '' },
          },
          '6_1_1': {
            value: '1\n3\n2\n4',
            verticalAlign: 1,
            isWrapText: true,
          },
          '6_2_8': {
            value: '',

            borderLeft: { type: 'hair', color: '' },
            borderRight: { type: 'hair', color: '' },
            borderTop: { type: 'hair', color: '' },
            borderBottom: { type: 'hair', color: '' },
          },
          '6_4_8': {
            value: '',
            borderLeft: { type: 'dotted', color: '' },
            borderRight: { type: 'dotted', color: '' },
            borderTop: { type: 'dotted', color: '' },
            borderBottom: { type: 'dotted', color: '' },
          },
          '6_6_5': {
            value: 2,

            horizontalAlign: 1,
            verticalAlign: 1,
            isWrapText: false,
          },
          '6_6_6': {
            value: '',

            horizontalAlign: 1,
            verticalAlign: 1,
            isWrapText: false,
          },
          '6_6_8': {
            value: '',

            borderLeft: { type: 'dashed', color: '' },
            borderRight: { type: 'dashed', color: '' },
            borderTop: { type: 'dashed', color: '' },
            borderBottom: { type: 'dashed', color: '' },
          },
          '6_7_5': {
            value: '',

            horizontalAlign: 1,
            verticalAlign: 1,
            isWrapText: false,
          },
          '6_7_6': {
            value: '',

            horizontalAlign: 1,
            verticalAlign: 1,
            isWrapText: false,
          },
          '6_8_8': {
            value: '',

            borderLeft: { type: 'dashDot', color: '' },
            borderRight: { type: 'dashDot', color: '' },
            borderTop: { type: 'dashDot', color: '' },
            borderBottom: { type: 'dashDot', color: '' },
          },
          '6_10_8': {
            value: '',
            borderLeft: { type: 'dashDotDot', color: '' },
            borderRight: { type: 'dashDotDot', color: '' },
            borderTop: { type: 'dashDotDot', color: '' },
            borderBottom: { type: 'dashDotDot', color: '' },
          },
          '6_12_8': {
            value: '',
            borderLeft: { type: 'double', color: '' },
            borderRight: { type: 'double', color: '' },
            borderTop: { type: 'double', color: '' },
            borderBottom: { type: 'double', color: '' },
          },
          '6_14_8': {
            value: '',
            borderLeft: { type: 'medium', color: '' },
            borderRight: { type: 'medium', color: '' },
            borderTop: { type: 'medium', color: '' },
            borderBottom: { type: 'medium', color: '' },
          },
          '6_16_8': {
            value: '',
            borderLeft: { type: 'medium', color: '' },
            borderRight: { type: 'medium', color: '' },
            borderTop: { type: 'medium', color: '' },
            borderBottom: { type: 'medium', color: '' },
          },
          '6_18_8': {
            value: '',
            borderLeft: { type: 'mediumDashed', color: '' },
            borderRight: { type: 'mediumDashed', color: '' },
            borderTop: { type: 'mediumDashed', color: '' },
            borderBottom: { type: 'mediumDashed', color: '' },
          },
          '6_20_8': {
            value: '',
            borderLeft: { type: 'mediumDashDot', color: '' },
            borderRight: { type: 'mediumDashDot', color: '' },
            borderTop: { type: 'mediumDashDot', color: '' },
            borderBottom: { type: 'mediumDashDot', color: '' },
          },
          '6_22_8': {
            value: '',
            borderLeft: { type: 'mediumDashDotDot', color: '' },
            borderRight: { type: 'mediumDashDotDot', color: '' },
            borderTop: { type: 'mediumDashDotDot', color: '' },
            borderBottom: { type: 'mediumDashDotDot', color: '' },
          },
          '6_24_8': { value: '' },
          '6_26_8': {
            value: '',
            borderLeft: { type: 'thick', color: '' },
            borderRight: { type: 'thick', color: '' },
            borderTop: { type: 'thick', color: '' },
            borderBottom: { type: 'thick', color: '' },
          },
        },
      };
      const expectResult = controller.toJSON();
      expect(expectResult).toEqual(result);
    });
  });
  describe('convertXMLToJSON', () => {
    test('ok', () => {
      const mockXML = `<worksheet>
      <sheetData>
        <row r="1" spans="1:1">
          <c r="A1" s="1">
            <v>123</v>
          </c>
        </row>
        <row r="2" spans="1:1">
          <c r="A2" s="2"/>
        </row>
      </sheetData>
    </worksheet>`;
      const result = convertXMLToJSON(mockXML);
      expect(result).toEqual({
        worksheet: {
          sheetData: {
            row: [
              {
                r: '1',
                spans: '1:1',
                c: {
                  r: 'A1',
                  s: '1',
                  v: {
                    '#text': '123',
                  },
                },
              },
              {
                r: '2',
                spans: '1:1',
                c: {
                  r: 'A2',
                  s: '2',
                },
              },
            ],
          },
        },
      });
    });
  });
});
