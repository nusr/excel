import { itBlock, getToken } from './util';
import { TokenType } from '../../../types';
describe('range operators', function () {
    const list = [
        [
            'A1:C1,A2:C2',
            [
                getToken(TokenType.IDENTIFIER, 'A1'),
                getToken(TokenType.COLON, ':'),
                getToken(TokenType.IDENTIFIER, 'C1'),
                getToken(TokenType.COMMA, ','),
                getToken(TokenType.IDENTIFIER, 'A2'),
                getToken(TokenType.COLON, ':'),
                getToken(TokenType.IDENTIFIER, 'C2'),
            ],
        ],
        [
            'A1:C1 A2:C2',
            [
                getToken(TokenType.IDENTIFIER, 'A1'),
                getToken(TokenType.COLON, ':'),
                getToken(TokenType.IDENTIFIER, 'C1'),
                getToken(TokenType.IDENTIFIER, 'A2'),
                getToken(TokenType.COLON, ':'),
                getToken(TokenType.IDENTIFIER, 'C2'),
            ],
        ],
    ];
    itBlock(list);
});
//# sourceMappingURL=range-operator.test.js.map