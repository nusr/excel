import { StoreValue, IController } from '@/types';
import { ForceUpdateType } from '@/react';
import { CELL_HEIGHT, CELL_WIDTH, assert } from '@/util';
class Store {
  private value: StoreValue;
  private forceUpdate: ForceUpdateType;
  private controller: IController | null = null;
  constructor() {
    this.value = {
      sheetList: [],
      currentSheetId: '',
      isCellEditing: false,
      editCellValue: '',
      activeCell: {
        value: '',
        row: 0,
        col: 0,
        style: {},
      },
      cellPosition: {
        left: -999,
        top: -999,
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
      },
      canRedo: false,
      canUndo: false,
      fontFamilyList: [],
    };
    this.forceUpdate = () => {};
  }
  setUpdate(f: ForceUpdateType) {
    this.forceUpdate = f;
  }
  get<T extends keyof StoreValue>(key: T): StoreValue[T] {
    return this.value[key];
  }
  set(newValue: Partial<StoreValue>) {
    this.value = Object.assign(this.value, newValue);
    this.forceUpdate();
  }
  setController(c: IController) {
    this.controller = c;
  }
  getController(): IController {
    assert(!!this.controller)
    return this.controller;
  }
}

const globalStore = new Store();
export default globalStore;
