import { BaseStore } from './base';

export interface ScrollStore {
  scrollTop: number;
  scrollLeft: number;
  top: number;
  left: number;
  showBottomBar: boolean;
  row: number;
  col: number;
}

export const scrollStore = new BaseStore<ScrollStore>({
  scrollTop: 0,
  scrollLeft: 0,
  top: 0,
  left: 0,
  showBottomBar: false,
  row: 0,
  col: 0,
});
