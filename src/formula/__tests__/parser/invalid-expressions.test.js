import { buildTree } from './util';
describe('invalid expressions', function () {
    it('SUM(', function () {
        expect(function () {
            buildTree('SUM(');
        }).toThrow();
    });
    it('+', function () {
        expect(function () {
            buildTree('+');
        }).toThrow();
    });
    it('SUM(,,', function () {
        expect(function () {
            buildTree('SUM(,,');
        }).toThrow();
    });
    it('>', function () {
        expect(function () {
            buildTree('>');
        }).toThrow();
    });
    it('a >', function () {
        expect(function () {
            buildTree('a >');
        }).toThrow();
    });
    it('> b', function () {
        expect(function () {
            buildTree('> b');
        }).toThrow();
    });
});
//# sourceMappingURL=invalid-expressions.test.js.map