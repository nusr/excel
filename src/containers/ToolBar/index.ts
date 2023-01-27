import { h, SmartComponent } from '@/react';
import {
  Icon,
  Button,
  ColorPicker,
  Github,
  Select,
  FillColorIcon,
} from '@/components';
import { FONT_SIZE_LIST, DEFAULT_FONT_SIZE, DEFAULT_FONT_COLOR } from '@/util';
import { StyleType, EUnderLine, OptionItem } from '@/types';

const underlineList: OptionItem[] = [
  {
    value: EUnderLine.NONE,
    label: 'none',
  },
  {
    value: EUnderLine.SINGLE,
    label: 'single underline',
  },
  {
    value: EUnderLine.DOUBLE,
    label: 'double underline',
  },
];

export const ToolbarContainer: SmartComponent = (state, controller) => {
  const getItemStyle = (value: string | number) => {
    return {
      'font-family': String(value),
      'font-size': '16px',
    };
  };
  const setCellStyle = (value: Partial<StyleType>) => {
    const cellData = controller.getCell(controller.getActiveCell());
    const styleData = cellData.style || {};
    Object.assign(styleData, value);
    controller.setCellStyle(styleData, controller.getRanges());
  };
  const { activeCell, fontFamilyList } = state;
  const { style = {} } = activeCell;
  const {
    isBold = false,
    isItalic = false,
    fontSize = DEFAULT_FONT_SIZE,
    fontColor = DEFAULT_FONT_COLOR,
    fillColor = '',
    isWrapText = false,
    underline = EUnderLine.NONE,
    fontFamily = '',
  } = style;
  return h(
    'div',
    {
      className: 'toolbar-wrapper',
    },
    Button(
      {
        disabled: !controller.canUndo(),
        onClick() {
          controller.undo();
        },
        testId: 'toolbar-undo',
      },
      Icon({ name: 'undo' }),
    ),
    Button(
      {
        disabled: !controller.canRedo(),
        onClick() {
          controller.redo();
        },
        testId: 'toolbar-redo',
      },
      Icon({ name: 'redo' }),
    ),
    Select({
      data: fontFamilyList,
      value: fontFamily,
      style: {
        width: '140px',
      },
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

    Button(
      {
        active: isBold,
        onClick: () => {
          setCellStyle({
            isBold: !isBold,
          });
        },
        testId: 'toolbar-bold',
        title: 'Bold',
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
        testId: 'toolbar-italic',
        title: 'Italic',
      },
      Icon({ name: 'italic' }),
    ),
    Select({
      data: underlineList,
      value: underline,
      style: {
        width: '130px',
      },
      title: 'Underline',
      onChange: (value) => {
        setCellStyle({ underline: Number(value) });
      },
    }),
    ColorPicker(
      {
        key: 'fill-color',
        color: fillColor,
        onChange: (value) => {
          setCellStyle({ fillColor: value });
        },
      },
      FillColorIcon({}),
    ),
    ColorPicker(
      {
        color: fontColor,
        onChange: (value) => {
          setCellStyle({ fontColor: value });
        },
        key: 'font-color',
      },
      Icon({ name: 'fontColor' }),
    ),
    Button(
      {
        onClick: () => {
          setCellStyle({ isWrapText: !isWrapText });
        },
        active: isWrapText,
        testId: 'toolbar-wrap-text',
      },
      'Wrap Text',
    ),
    Github({}),
  );
};

ToolbarContainer.displayName = 'ToolbarContainer';
