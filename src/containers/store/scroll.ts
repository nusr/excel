import { BaseStore } from './base';
import { ExtendIndex } from '@/types';

export interface ScrollStore {
  scrollTop: number;
  scrollLeft: number;
}

export const scrollStore = new BaseStore<ScrollStore & ExtendIndex>({
  scrollTop: 0,
  scrollLeft: 0,
});
