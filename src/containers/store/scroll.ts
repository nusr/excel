import { BaseStore } from './base';

export interface ScrollStore {
  scrollTop: number;
  scrollLeft: number;
}

export const scrollStore = new BaseStore<ScrollStore>({
  scrollTop: 0,
  scrollLeft: 0,
});
