import { Token } from '../../token';
import type { TokenType } from '../../../types';
export type BlockType = [string, Token[]];
export declare function itBlock(list: Array<BlockType>): void;
export declare function getToken(type: TokenType, value: string): Token;
