import { Parser } from '../../parser';
import { Scanner } from '../../scanner';
export function buildTree(source) {
    return buildTreeList(source)[0];
}
export function buildTreeList(source) {
    const tokens = new Scanner(source).scan();
    const list = new Parser(tokens).parse();
    return list;
}
//# sourceMappingURL=util.js.map