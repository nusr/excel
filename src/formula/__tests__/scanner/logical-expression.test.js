import { itBlock, getToken } from './util';
import { TokenType } from '../../../types';
describe('logical expressions', function () {
    const list = [
        ['TRUE', [getToken(TokenType.TRUE, 'TRUE')]],
        ['true', [getToken(TokenType.TRUE, 'TRUE')]],
        ['FALSE', [getToken(TokenType.FALSE, 'FALSE')]],
        ['false', [getToken(TokenType.FALSE, 'FALSE')]],
    ];
    itBlock(list);
});
//# sourceMappingURL=logical-expression.test.js.map