import { parseFormula } from '../..';
describe('parseFormula function', () => {
    it('not defined function', () => {
        expect(parseFormula('foo()')).toEqual({
            error: '#NAME?',
            result: null,
            expressionStr: '',
        });
    });
    it('not support function', () => {
        expect(parseFormula('BAHTTEXT()')).toEqual({
            error: '#NAME?',
            result: null,
            expressionStr: '',
        });
    });
    it('function SUM', () => {
        expect(parseFormula('SUM(1,2)')).toEqual({
            error: null,
            result: 3,
            expressionStr: 'SUM(1,2)',
        });
        expect(parseFormula('SUM(1,)')).toEqual({
            error: null,
            result: 1,
            expressionStr: 'SUM(1)',
        });
        expect(parseFormula('sUM(1,2)')).toEqual({
            error: null,
            result: 3,
            expressionStr: 'SUM(1,2)',
        });
        expect(parseFormula('suM(1,2)')).toEqual({
            error: null,
            result: 3,
            expressionStr: 'SUM(1,2)',
        });
        expect(parseFormula('sum(1,2)')).toEqual({
            error: null,
            result: 3,
            expressionStr: 'SUM(1,2)',
        });
        expect(parseFormula('SUM(1,SUM(2,3))')).toEqual({
            error: null,
            result: 6,
            expressionStr: 'SUM(1,SUM(2,3))',
        });
    });
    it('@SUM', () => {
        expect(parseFormula('@SUM(1)')).toEqual({
            error: '#NAME?',
            result: null,
            expressionStr: '',
        });
    });
    it('function ABS', () => {
        expect(parseFormula('ABS()')).toEqual({
            error: '#VALUE!',
            result: null,
            expressionStr: '',
        });
        expect(parseFormula('ABS(1)')).toEqual({
            error: null,
            result: 1,
            expressionStr: 'ABS(1)',
        });
        expect(parseFormula('ABS(-1)')).toEqual({
            error: null,
            result: 1,
            expressionStr: 'ABS(-1)',
        });
        expect(parseFormula('ABS("ff")')).toEqual({
            error: '#VALUE!',
            result: null,
            expressionStr: '',
        });
    });
});
//# sourceMappingURL=function.test.js.map