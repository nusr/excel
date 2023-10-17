import { itBlock, getToken } from './util';
import { TokenType } from '../../../types';
describe('string expressions', function () {
    const list = [
        ['"cat"', [getToken(TokenType.STRING, 'cat')]],
        [
            '"con"&"cat"',
            [
                getToken(TokenType.STRING, 'con'),
                getToken(TokenType.CONCATENATE, '&'),
                getToken(TokenType.STRING, 'cat'),
            ],
        ],
        [
            '"con"&"cat"&"enate"',
            [
                getToken(TokenType.STRING, 'con'),
                getToken(TokenType.CONCATENATE, '&'),
                getToken(TokenType.STRING, 'cat'),
                getToken(TokenType.CONCATENATE, '&'),
                getToken(TokenType.STRING, 'enate'),
            ],
        ],
    ];
    itBlock(list);
});
//# sourceMappingURL=string-expression.test.js.map