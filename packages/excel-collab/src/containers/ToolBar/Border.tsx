import { memo, useState, useRef } from 'react';
import styles from './Border.module.css';
import { BorderItem, IRange, BorderType } from '../../types';
import { BORDER_TYPE_MAP, isRow, isCol } from '../../util';
import i18n from '../../i18n';
import { useExcel } from '../store';
import {
  MenuTrigger,
  SubmenuTrigger,
  Menu,
  MenuItem,
} from '../../component/Menu';
import { Button } from '../../component/Button';
import { ChevronDown } from 'lucide-react';
import { COLOR_PICKER_COLOR_LIST } from '../../util';

type ShortCutType =
  | 'no-border'
  | 'all-borders'
  | 'outside-borders'
  | 'thick-box-border'
  | 'bottom-border'
  | 'top-border'
  | 'left-border'
  | 'right-border';

export const BorderToolBar = memo(() => {
  const { controller } = useExcel();
  const [color, setColor] = useState('');
  const [borderType, setBorderType] = useState<BorderType>('thin');
  const [type, setType] = useState<ShortCutType>('all-borders');
  const state = useRef({ color, borderType, type });
  const getBorderItem = () => {
    const item: BorderItem = {
      color: state.current.color,
      type: state.current.borderType,
    };
    return item;
  };
  const handleAllBorders = () => {
    setType('all-borders');
    const item = getBorderItem();
    controller.updateCellStyle(
      {
        borderLeft: item,
        borderRight: item,
        borderTop: item,
        borderBottom: item,
      },
      controller.getActiveRange().range,
    );
  };
  const handleColorChange = (c: unknown) => {
    state.current.color = String(c);
    setColor(String(c));
    handleAllBorders();
  };
  const handleBorderStyle = (t: BorderType) => {
    state.current.borderType = t;
    setBorderType(t);
    handleAllBorders();
  };

  const handleNoBorder = () => {
    setType('no-border');
    controller.updateCellStyle(
      {
        borderLeft: undefined,
        borderRight: undefined,
        borderTop: undefined,
        borderBottom: undefined,
      },
      controller.getActiveRange().range,
    );
  };
  const handleBottomBorder = () => {
    setType('bottom-border');
    const range = controller.getActiveRange().range;
    const item = getBorderItem();
    const { row, col, colCount, rowCount } = range;
    controller.updateCellStyle(
      {
        borderBottom: item,
      },
      {
        row: row + rowCount - 1,
        rowCount: 1,
        colCount,
        col: isRow(range) ? 0 : col,
        sheetId: '',
      },
    );
  };
  const handleTopBorder = () => {
    setType('top-border');
    const range = controller.getActiveRange().range;
    const item = getBorderItem();
    const { row, col, colCount } = range;
    const cell: IRange = {
      row,
      rowCount: 1,
      colCount,
      col: isRow(range) ? 0 : col,
      sheetId: '',
    };
    controller.updateCellStyle(
      {
        borderTop: item,
      },
      cell,
    );
  };
  const handleLeftBorder = () => {
    setType('left-border');
    const range = controller.getActiveRange().range;
    const item = getBorderItem();
    const { row, col, rowCount } = range;
    controller.updateCellStyle(
      {
        borderLeft: item,
      },
      {
        row: isCol(range) ? 0 : row,
        rowCount,
        colCount: 1,
        col,
        sheetId: '',
      },
    );
  };
  const handleRightBorder = () => {
    setType('right-border');
    const range = controller.getActiveRange().range;
    const item = getBorderItem();
    const { row, col, rowCount, colCount } = range;
    controller.updateCellStyle(
      {
        borderRight: item,
      },
      {
        row: isCol(range) ? 0 : row,
        rowCount,
        colCount: 1,
        col: col + colCount - 1,
        sheetId: '',
      },
    );
  };
  const handleOutSideBorders = () => {
    handleTopBorder();
    handleRightBorder();
    handleBottomBorder();
    handleLeftBorder();
    setType('outside-borders');
  };
  const handleThickBoxBorder = () => {
    const oldType = state.current.borderType;
    state.current.borderType = 'medium';
    handleOutSideBorders();
    state.current.borderType = oldType;
    setType('thick-box-border');
  };
  const handleShortCut = () => {
    const record: Record<ShortCutType, () => void> = {
      'all-borders': handleAllBorders,
      'no-border': handleNoBorder,
      'bottom-border': handleBottomBorder,
      'top-border': handleTopBorder,
      'left-border': handleLeftBorder,
      'right-border': handleRightBorder,
      'thick-box-border': handleThickBoxBorder,
      'outside-borders': handleOutSideBorders,
    };
    record[type]();
  };

  return (
    <div className={styles['container']}>
      <Button
        onPress={handleShortCut}
        data-testid="toolbar-border-shortcut"
        aria-label="Border Shortcut"
      >
        {i18n.t(type)}
      </Button>
      <MenuTrigger>
        <Button
          data-testid="toolbar-border-trigger"
          aria-label="Border Trigger"
        >
          <ChevronDown />
        </Button>
        <Menu data-testid="toolbar-border" aria-label="Toolbar Border Menu">
          <MenuItem onPress={handleNoBorder} data-testid="toolbar-no-border">
            {i18n.t('no-border')}
          </MenuItem>
          <MenuItem
            onPress={handleAllBorders}
            data-testid="toolbar-all-borders"
          >
            {i18n.t('all-borders')}
          </MenuItem>
          <MenuItem
            onPress={handleOutSideBorders}
            data-testid="toolbar-outside-borders"
          >
            {i18n.t('outside-borders')}
          </MenuItem>
          <MenuItem
            onPress={handleThickBoxBorder}
            data-testid="toolbar-thick-box-border"
          >
            {i18n.t('thick-box-border')}
          </MenuItem>
          <MenuItem
            onPress={handleBottomBorder}
            data-testid="toolbar-bottom-border"
          >
            {i18n.t('bottom-border')}
          </MenuItem>
          <MenuItem onPress={handleTopBorder} data-testid="toolbar-top-border">
            {i18n.t('top-border')}
          </MenuItem>
          <MenuItem
            onPress={handleLeftBorder}
            data-testid="toolbar-left-border"
          >
            {i18n.t('left-border')}
          </MenuItem>
          <MenuItem
            onPress={handleRightBorder}
            data-testid="toolbar-right-border"
          >
            {i18n.t('right-border')}
          </MenuItem>
          <SubmenuTrigger>
            <MenuItem data-testid="toolbar-border-color-trigger">
              {i18n.t('line-color')}
            </MenuItem>
            <Menu aria-label="Toolbar Border Color Menu">
              {COLOR_PICKER_COLOR_LIST.map((item) => (
                <MenuItem
                  key={item}
                  id={item}
                  onPress={() => handleColorChange(item)}
                >
                  {item}
                </MenuItem>
              ))}
            </Menu>
          </SubmenuTrigger>
          <SubmenuTrigger>
            <MenuItem data-testid="toolbar-border-style">
              {i18n.t('line-style')}
            </MenuItem>
            <Menu aria-label="Toolbar Border Style Menu">
              {Object.keys(BORDER_TYPE_MAP).map((border) => (
                <MenuItem
                  key={border}
                  id={border}
                  onPress={() => handleBorderStyle(border as BorderType)}
                  data-testid={`toolbar-border-style-${border}`}
                >
                  {border}
                </MenuItem>
              ))}
            </Menu>
          </SubmenuTrigger>
        </Menu>
      </MenuTrigger>
    </div>
  );
});
BorderToolBar.displayName = 'BorderToolBar';
