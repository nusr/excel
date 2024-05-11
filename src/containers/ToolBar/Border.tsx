import React, {
  FunctionComponent,
  memo,
  useState,
  useRef,
  useCallback,
} from 'react';
import styles from './Border.module.css';
import {
  Button,
  Icon,
  Menu,
  MenuItem,
  SubMenu,
  ColorPicker,
} from '../components';
import { IController, BorderType, BorderItem } from '@/types';
import { BORDER_TYPE_MAP } from '@/util';

interface BorderToolBarProps {
  controller: IController;
}

export const BorderToolBar: FunctionComponent<BorderToolBarProps> = memo(
  ({ controller }) => {
    const [color, setColor] = useState('');
    const [type, setType] = useState<BorderType>('thin');
    const state = useRef({ color, type });
    const getBorderItem = () => {
      const item: BorderItem = {
        color: state.current.color,
        type: state.current.type,
      };
      return item;
    };
    const handleAllBorders = () => {
      const item = getBorderItem();
      controller.updateCellStyle(
        {
          border: {
            left: item,
            right: item,
            top: item,
            bottom: item,
          },
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
      state.current.type = t;
      setType(t);
      handleAllBorders();
    };
    const handleNoBorder = useCallback(() => {
      controller.updateCellStyle(
        {
          border: undefined,
        },
        controller.getActiveRange().range,
      );
    }, []);
    const handleBottomBorder = useCallback(() => {
      const item = getBorderItem();
      controller.updateCellStyle(
        {
          border: {
            bottom: item,
          },
        },
        controller.getActiveRange().range,
      );
    }, []);
    const handleTopBorder = useCallback(() => {
      const item = getBorderItem();
      controller.updateCellStyle(
        {
          border: {
            top: item,
          },
        },
        controller.getActiveRange().range,
      );
    }, []);
    const handleLeftBorder = useCallback(() => {
      const item = getBorderItem();
      controller.updateCellStyle(
        {
          border: {
            left: item,
          },
        },
        controller.getActiveRange().range,
      );
    }, []);
    const handleRightBorder = useCallback(() => {
      const item = getBorderItem();
      controller.updateCellStyle(
        {
          border: {
            right: item,
          },
        },
        controller.getActiveRange().range,
      );
    }, []);
    // TODO
    const handleOutSideBorders = useCallback(() => {}, []);
    // TODO
    const handleThickBoxBorder = useCallback(() => {}, []);
    return (
      <div className={styles['container']}>
        <Button
          onClick={handleAllBorders}
          type="plain"
          className={styles['main']}
          testId="toolbar-border-shortcut"
        >
          All Borders
        </Button>
        <Menu
          className={styles['menu']}
          label={<Icon name="down"></Icon>}
          isPlain={true}
          testId="toolbar-border"
          position="bottom"
        >
          <MenuItem onClick={handleNoBorder}>No Border</MenuItem>
          <MenuItem onClick={handleAllBorders}>All Borders</MenuItem>
          <MenuItem onClick={handleOutSideBorders}>OutSide Borders</MenuItem>
          <MenuItem onClick={handleThickBoxBorder}>Thick Box Border</MenuItem>
          <MenuItem onClick={handleBottomBorder}>Bottom Border</MenuItem>
          <MenuItem onClick={handleTopBorder}>Top Border</MenuItem>
          <MenuItem onClick={handleLeftBorder}>Left Border</MenuItem>
          <MenuItem onClick={handleRightBorder}>Right Border</MenuItem>
          <MenuItem>
            <ColorPicker
              color={color}
              onChange={handleColorChange}
              position="right"
            >
              <span style={{ color }}>Line Color &gt;</span>
            </ColorPicker>
          </MenuItem>
          <SubMenu label="Line Style >">
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
