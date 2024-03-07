import { convertXMLToJSON, convertXMLDataToModel } from '../import';
import { WorkBookJSON } from '@/types';
describe('import.test.ts', () => {
  describe('convertColorToHex', () => {
    it('normal', () => {
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
  describe('convertXMLDataToModel', () => {
    it('normal', () => {
      const xml = {
        'xl/_rels/workbook.xml.rels': {
          Relationships: {
            Relationship: [
              {
                Id: 'rId1',
                Target: 'worksheets/sheet1.xml',
              },
              {
                Id: 'rId2',
                Target: 'worksheets/sheet2.xml',
              },
            ],
          },
        },
        'xl/worksheets/sheet1.xml': {
          worksheet: {
            sheetData: {
              row: [
                {
                  customHeight: '1',
                  ht: '200pt',
                  r: '1',
                  c: [
                    {
                      r: 'A1',
                      s: '1',
                      v: {
                        '#text': '1',
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
        'xl/styles.xml': {
          styleSheet: {
            fonts: {
              fills: {
                fill: [
                  {},
                  {
                    patternFill: {
                      fgColor: {
                        rgb: 'FFFFFFCC',
                      },
                    },
                  },
                ],
              },
              font: [
                {},
                {
                  sz: {
                    val: '16pt',
                    b: '1',
                    i: '1',
                    strike: '1',
                    u: '1',
                    color: {
                      rgb: 'FFFF0000',
                    },
                  },
                },
              ],
            },
            cellXfs: {
              xf: [
                {},
                {
                  applyFill: '1',
                  fillId: '1',
                  applyNumberFormat: '',
                  numFmtId: '1',
                  applyAlignment: '1',
                  alignment: {
                    horizontal: 'left',
                    vertical: 'top',
                    wrapText: '1',
                  },
                  applyFont: '1',
                  fontId: '1',
                },
              ],
            },
          },
        },
        'xl/workbook.xml': {
          workbook: {
            definedNames: {
              definedName: [
                {
                  name: 'foo',
                  '#text': 'Sheet1!$A$1',
                },
                {
                  name: 'boo',
                  '#text': 'Sheet2!$A$1',
                },
              ],
            },
            sheets: {
              sheet: [
                {
                  name: 'Sheet1',
                  sheetId: '1',
                  'r:id': 'rId1',
                },
                {
                  name: 'Sheet2',
                  sheetId: '2',
                  'r:id': 'rId2',
                },
              ],
            },
          },
        },
      };
      const result: WorkBookJSON = {
        workbook: [
          {
            sheetId: '1',
            name: 'Sheet1',
            isHide: false,
            rowCount: 200,
            colCount: 200,
          },
          {
            sheetId: '2',
            name: 'Sheet2',
            isHide: false,
            rowCount: 200,
            colCount: 200,
          },
        ],
        mergeCells: [],
        customHeight: { '1_0': { isHide: false, len: 200 } },
        customWidth: {},
        definedNames: {
          foo: { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '1' },
          boo: { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '2' },
        },
        currentSheetId: '1',
        drawings: [],
        rangeMap: {},
        worksheets_1: {
          '0_0': {
            style: {
              fontFamily: undefined,
              fontSize: 16,
              horizontalAlign: 0,
              isBold: false,
              isItalic: false,
              isStrike: false,
              isWrapText: true,
              underline: 0,
              verticalAlign: 0,
            },
            value: '1',
          },
        },
      };
      expect(convertXMLDataToModel(xml)).toEqual(result);
    });
  });
});
