import { Model, History } from '..';
import { Range } from '@/util';
describe('model.test.ts', () => {
    test('normal', () => {
        const model = new Model(new History());
        expect(model.getSheetList()).toHaveLength(0);
        model.addSheet();
        expect(model.getSheetList()).toHaveLength(1);
    });
    test('setCellValue', () => {
        const model = new Model(new History());
        model.addSheet();
        expect(model.getCell(new Range(0, 0, 1, 1, ''))).toEqual({
            style: undefined,
            row: 0,
            col: 0,
        });
        model.setCellValues([['test']], [], [new Range(0, 0, 1, 1, model.getCurrentSheetId())]);
        expect(model.getCell(new Range(0, 0, 1, 1, ''))).toEqual({
            style: undefined,
            value: 'test',
            formula: '',
            row: 0,
            col: 0,
        });
    });
    test('toJSON', () => {
        const model = new Model(new History());
        expect(model.toJSON()).toEqual({
            workbook: [],
            worksheets: {},
            mergeCells: [],
            customHeight: {},
            customWidth: {},
            definedNames: {}
        });
    });
    test('fromJSON', () => {
        const model = new Model(new History());
        model.fromJSON({
            workbook: [
                {
                    sheetId: '1',
                    isHide: false,
                    activeCell: {
                        row: 0,
                        col: 1,
                        rowCount: 1,
                        colCount: 1,
                        sheetId: '',
                    },
                    rowCount: 200,
                    colCount: 200,
                    name: 'test',
                },
            ],
            worksheets: {},
            mergeCells: [
                {
                    row: 1,
                    col: 1,
                    colCount: 3,
                    rowCount: 3,
                    sheetId: '1',
                },
            ],
            customHeight: {},
            customWidth: {},
            definedNames: {}
        }),
            expect(model.toJSON()).toEqual({
                workbook: [
                    {
                        sheetId: '1',
                        activeCell: {
                            row: 0,
                            col: 1,
                            rowCount: 1,
                            colCount: 1,
                            sheetId: '',
                        },
                        isHide: false,
                        rowCount: 200,
                        colCount: 200,
                        name: 'test',
                    },
                ],
                worksheets: {},
                mergeCells: [
                    {
                        row: 1,
                        col: 1,
                        colCount: 3,
                        rowCount: 3,
                        sheetId: '1',
                    },
                ],
                customHeight: {},
                customWidth: {},
                definedNames: {}
            });
    });
});
//# sourceMappingURL=model.test.js.map