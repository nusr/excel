import { itBlock, getToken, BlockType } from './util';
import { TokenType } from '@excel/shared';

describe('string expressions', () => {
  const list: BlockType[] = [
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
