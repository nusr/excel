import { itBlock, getToken } from './util';
import { TokenType } from '../../../types';
describe('define name expression', function () {
    const list = [
        ['foo', [getToken(TokenType.IDENTIFIER, 'foo')]],
    ];
    itBlock(list);
});
//# sourceMappingURL=define-name.test.js.map