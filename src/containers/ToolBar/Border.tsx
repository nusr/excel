import React, { FunctionComponent, memo, useState, useRef } from 'react';
import styles from './Border.module.css';
import {
  Button,
  Icon,
  Menu,
  MenuItem,
  SubMenu,
  ColorPicker,
} from '../../components';
import { IController, BorderType, BorderItem } from '@/types';
import { BORDER_TYPE_MAP, isRow, isCol } from '@/util';
import { $ } from '@/i18n';

interface BorderToolBarProps {
  controller: IController;
}

type ShortCutType =
  | 'no-border'
  | 'all-borders'
  | 'outside-borders'
  | 'thick-box-border'
  | 'bottom-border'
  | 'top-border'
  | 'left-border'
  | 'right-border';

export const BorderToolBar: FunctionComponent<BorderToolBarProps> = memo(
  ({ controller }) => {
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
    const handleColorChange = (c: string) => {
      state.current.color = c;
      setColor(c);
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
      controller.updateCellStyle(
        {
          borderTop: item,
        },
        {
          row,
          rowCount: 1,
          colCount,
          col: isRow(range) ? 0 : col,
          sheetId: '',
        },
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
          onClick={handleShortCut}
          type="plain"
          className={styles['main']}
          testId="toolbar-border-shortcut"
          title={$(type)}
        >
          {$(type)}
        </Button>
        <Menu
          className={styles['menu']}
          label={<Icon name="down"></Icon>}
          isPlain={true}
          testId="toolbar-border"
          position="bottom"
          size="small"
          portalClassName={styles.portal}
        >
          <MenuItem onClick={handleNoBorder}>{$('no-border')}</MenuItem>
          <MenuItem onClick={handleAllBorders}>{$('all-borders')}</MenuItem>
          <MenuItem onClick={handleOutSideBorders}>
            {$('outside-borders')}
          </MenuItem>
          <MenuItem onClick={handleThickBoxBorder}>
            {$('thick-box-border')}
          </MenuItem>
          <MenuItem onClick={handleBottomBorder}>{$('bottom-border')}</MenuItem>
          <MenuItem onClick={handleTopBorder}>{$('top-border')}</MenuItem>
          <MenuItem onClick={handleLeftBorder}>{$('left-border')}</MenuItem>
          <MenuItem onClick={handleRightBorder}>{$('right-border')}</MenuItem>
          <MenuItem>
            <ColorPicker
              color={color}
              onChange={handleColorChange}
              position="right"
            >
              <span style={{ color }}>{$('line-color')} &gt;</span>
            </ColorPicker>
          </MenuItem>
          <SubMenu label={`${$('line-style')} >`}>
            {Object.keys(BORDER_TYPE_MAP).map((border) => (
              <MenuItem
                key={border}
                onClick={() => handleBorderStyle(border as BorderType)}
              >
                {border}
              </MenuItem>
            ))}
          </SubMenu>
        </Menu>
      </div>
    );
  },
);
BorderToolBar.displayName = 'BorderToolBar';
