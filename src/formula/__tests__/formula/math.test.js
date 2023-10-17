import { SUM } from '../../formula/math';
describe('math.test.ts', () => {
    describe('SUM', () => {
        test('normal', () => {
            expect(SUM(1, 2, 'a')).toEqual(3);
        });
    });
});
//# sourceMappingURL=math.test.js.map