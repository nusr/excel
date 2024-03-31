import { BaseStore } from './base';

export interface ScrollStore {
  scrollTop: number;
  scrollLeft: number;
  showBottomBar: boolean;
}

export const scrollStore = new BaseStore<ScrollStore>({
  scrollTop: 0,
  scrollLeft: 0,
  showBottomBar: false,
});
