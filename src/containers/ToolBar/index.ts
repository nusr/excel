import { h } from '@/react';
import {
  Icon,
  Button,
  ColorPicker,
  Github,
  Select,
  FillColorIcon,
} from '@/components';
import {
  DEFAULT_FONT_FAMILY,
  FONT_SIZE_LIST,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
} from '@/util';
import { StyleType, EWrap, SmartComponent } from '@/types';

export const ToolbarContainer: SmartComponent = (
  state,
  controller,
) => {
  const getItemStyle = (value: string | number) => {
    return `font-family:${value}`;
  };
  const setCellStyle = (value: Partial<StyleType>) => {
    controller.setCellStyle(value);
  };
  const { activeCell, canRedo, canUndo, fontFamilyList } = state;
  const { style = {} } = activeCell;
  const {
    isBold,
    isItalic,
    fontSize = DEFAULT_FONT_SIZE,
    fontColor = DEFAULT_FONT_COLOR,
    fillColor = '',
    fontFamily = DEFAULT_FONT_FAMILY,
    wrapText,
  } = style;
  return h(
    'div',
    {
      className: 'toolbar-wrapper',
    },
    Button(
      {
        disabled: !canUndo,
        onClick() {
          controller.undo();
        },
      },
      Icon({ name: 'undo' }),
    ),
    Button(
      {
        disabled: !canRedo,
        onClick() {
          controller.redo();
        },
      },
      Icon({ name: 'redo' }),
    ),
    Button(
      {
        active: isBold,
        onClick: () => {
          setCellStyle({
            isBold: !isBold,
          });
        },
      },
      Icon({ name: 'bold' }),
    ),
    Button(
      {
        active: isItalic,
        onClick: () => {
          setCellStyle({
            isItalic: !isItalic,
          });
        },
      },
      Icon({ name: 'italic' }),
    ),
    Button(
      {
        onClick: () => {
          setCellStyle({ wrapText: EWrap.AUTO_WRAP });
        },
        active: wrapText === EWrap.AUTO_WRAP,
      },
      'Wrap Text',
    ),
    Select({
      data: fontFamilyList,
      value: fontFamily,
      getItemStyle: getItemStyle,
      onChange: (value) => {
        setCellStyle({ fontFamily: String(value) });
      },
    }),
    Select({
      data: FONT_SIZE_LIST,
      value: fontSize,
      onChange: (value) => {
        setCellStyle({ fontSize: Number(value) });
      },
    }),
    ColorPicker(
      {
        color: fontColor,
        style: 'margin-left:8px',
        onChange: (value) => {
          setCellStyle({ fontColor: value });
        },
      },
      Icon({ name: 'fontColor' }),
    ),
    ColorPicker(
      {
        color: fillColor,
        style: 'margin-left:8px',
        onChange: (value) => {
          setCellStyle({ fillColor: value });
        },
      },
      FillColorIcon({}),
    ),
    Github({}),
  );
};

ToolbarContainer.displayName = 'ToolbarContainer';