import { Token } from '../../token';
import { Scanner } from '../../scanner';
export function itBlock(list) {
    for (const item of list) {
        const [formula, expected] = item;
        it(formula, () => {
            const result = new Scanner(formula).scan();
            result.pop();
            expect(result).toEqual(expected);
        });
    }
}
export function getToken(type, value) {
    return new Token(type, value);
}
//# sourceMappingURL=util.js.map