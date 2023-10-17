import { DEFAULT_POSITION } from '@/util';
import { BaseStore } from './base';
const cellData = {
    value: '',
    formula: '',
    row: 0,
    col: 0,
    left: DEFAULT_POSITION,
    top: DEFAULT_POSITION,
    width: 0,
    height: 0,
};
export const activeCellStore = new BaseStore(cellData);
//# sourceMappingURL=activeCell.js.map