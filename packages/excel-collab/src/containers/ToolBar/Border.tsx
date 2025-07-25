import { memo, useState, useRef } from 'react';
import styles from './Border.module.css';
import {
  Button,
  Icon,
  Menu,
  MenuItem,
  SubMenu,
  ColorPicker,
} from '../../components';
import { BorderItem, IRange, BorderType } from '../../types';
import { BORDER_TYPE_MAP, isRow, isCol } from '../../util';
import i18n from '../../i18n';
import { useExcel } from '../store';

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
        onClick={handleShortCut}
        type="plain"
        className={styles['main']}
        testId="toolbar-border-shortcut"
        title={i18n.t(type)}
      >
        {i18n.t(type)}
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
        <MenuItem onClick={handleNoBorder} testId="toolbar-no-border">
          {i18n.t('no-border')}
        </MenuItem>
        <MenuItem onClick={handleAllBorders} testId="toolbar-all-borders">
          {i18n.t('all-borders')}
        </MenuItem>
        <MenuItem
          onClick={handleOutSideBorders}
          testId="toolbar-outside-borders"
        >
          {i18n.t('outside-borders')}
        </MenuItem>
        <MenuItem
          onClick={handleThickBoxBorder}
          testId="toolbar-thick-box-border"
        >
          {i18n.t('thick-box-border')}
        </MenuItem>
        <MenuItem onClick={handleBottomBorder} testId="toolbar-bottom-border">
          {i18n.t('bottom-border')}
        </MenuItem>
        <MenuItem onClick={handleTopBorder} testId="toolbar-top-border">
          {i18n.t('top-border')}
        </MenuItem>
        <MenuItem onClick={handleLeftBorder} testId="toolbar-left-border">
          {i18n.t('left-border')}
        </MenuItem>
        <MenuItem onClick={handleRightBorder} testId="toolbar-right-border">
          {i18n.t('right-border')}
        </MenuItem>
        <MenuItem>
          <ColorPicker
            color={color}
            onChange={handleColorChange}
            position="right"
            testId="toolbar-border-color"
          >
            <span style={{ color }}>{i18n.t('line-color')} &gt;</span>
          </ColorPicker>
        </MenuItem>
        <SubMenu label={`${i18n.t('line-style')} >`} testId="toolbar-border-style">
          {Object.keys(BORDER_TYPE_MAP).map((border) => (
            <MenuItem
              key={border}
              onClick={() => handleBorderStyle(border as BorderType)}
              testId={`toolbar-border-style-${border}`}
              active={borderType === border}
            >
              {border}
            </MenuItem>
          ))}
        </SubMenu>
      </Menu>
    </div>
  );
});
BorderToolBar.displayName = 'BorderToolBar';
