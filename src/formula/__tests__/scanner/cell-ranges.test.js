import { itBlock, getToken } from './util';
import { TokenType } from '../../../types';
describe('cell ranges', function () {
    describe('A1 style', function () {
        const list = [
            ['A1', [getToken(TokenType.IDENTIFIER, 'A1')]],
            ['$A$1', [getToken(TokenType.IDENTIFIER, '$A$1')]],
            ['A$1', [getToken(TokenType.IDENTIFIER, 'A$1')]],
            ['$A1', [getToken(TokenType.IDENTIFIER, '$A1')]],
            [
                'A10:A20',
                [
                    getToken(TokenType.IDENTIFIER, 'A10'),
                    getToken(TokenType.COLON, ':'),
                    getToken(TokenType.IDENTIFIER, 'A20'),
                ],
            ],
            [
                'A1:C1',
                [
                    getToken(TokenType.IDENTIFIER, 'A1'),
                    getToken(TokenType.COLON, ':'),
                    getToken(TokenType.IDENTIFIER, 'C1'),
                ],
            ],
            [
                '5:5',
                [
                    getToken(TokenType.NUMBER, '5'),
                    getToken(TokenType.COLON, ':'),
                    getToken(TokenType.NUMBER, '5'),
                ],
            ],
            [
                '5:10',
                [
                    getToken(TokenType.NUMBER, '5'),
                    getToken(TokenType.COLON, ':'),
                    getToken(TokenType.NUMBER, '10'),
                ],
            ],
            [
                'H:H',
                [
                    getToken(TokenType.IDENTIFIER, 'H'),
                    getToken(TokenType.COLON, ':'),
                    getToken(TokenType.IDENTIFIER, 'H'),
                ],
            ],
            [
                'H:J',
                [
                    getToken(TokenType.IDENTIFIER, 'H'),
                    getToken(TokenType.COLON, ':'),
                    getToken(TokenType.IDENTIFIER, 'J'),
                ],
            ],
            [
                'A10:E20',
                [
                    getToken(TokenType.IDENTIFIER, 'A10'),
                    getToken(TokenType.COLON, ':'),
                    getToken(TokenType.IDENTIFIER, 'E20'),
                ],
            ],
        ];
        itBlock(list);
    });
});
//# sourceMappingURL=cell-ranges.test.js.map