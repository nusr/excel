import { h, Component } from '@/react';
import {
  Icon,
  IconProps,
  Button,
  ButtonProps,
  ColorPicker,
  ColorPickerProps,
  Github,
  Select,
  SelectProps,
  FillColorIcon,
} from '@/components';
import {
  DEFAULT_FONT_FAMILY,
  FONT_SIZE_LIST,
  FONT_FAMILY_LIST,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_COLOR,
  isSupportFontFamily,
} from '@/util';
import { StyleType, EWrap } from '@/types';
import globalStore from '@/store';

export const ToolbarContainer: Component = () => {
  const getItemStyle = (value: string | number) => {
    return `font-family:${value}`;
  };
  const setCellStyle = (value: Partial<StyleType>) => {
    globalStore.getController().setCellStyle(value);
  };
  const activeCell = globalStore.get('activeCell');
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
    h<ButtonProps>(
      Button,
      {
        disabled: !globalStore.get('canUndo'),
        onClick() {
          globalStore.getController().undo();
        },
      },
      h<IconProps>(Icon, { name: 'undo' }),
    ),
    h<ButtonProps>(
      Button,
      {
        disabled: !globalStore.get('canRedo'),
        onClick() {
          globalStore.getController().redo();
        },
      },
      h<IconProps>(Icon, { name: 'redo' }),
    ),
    h<ButtonProps>(
      Button,
      {
        active: isBold,
        onClick: () => {
          setCellStyle({
            isBold: !isBold,
          });
        },
      },
      h<IconProps>(Icon, { name: 'bold' }),
    ),
    h<ButtonProps>(
      Button,
      {
        active: isItalic,
        onClick: () => {
          setCellStyle({
            isItalic: !isItalic,
          });
        },
      },
      h<IconProps>(Icon, { name: 'italic' }),
    ),
    h<ButtonProps>(
      Button,
      {
        onClick: () => {
          setCellStyle({ wrapText: EWrap.AUTO_WRAP });
        },
        active: wrapText === EWrap.AUTO_WRAP,
      },
      'Wrap Text',
    ),
    h<SelectProps>(Select, {
      data: globalStore.get('fontFamilyList'),
      value: fontFamily,
      getItemStyle: getItemStyle,
      onChange: (value) => {
        setCellStyle({ fontFamily: String(value) });
      },
    }),
    h<SelectProps>(Select, {
      data: FONT_SIZE_LIST,
      value: fontSize,
      onChange: (value) => {
        setCellStyle({ fontSize: Number(value) });
      },
    }),
    h<ColorPickerProps>(
      ColorPicker,
      {
        color: fontColor,
        style: 'margin-left:8px',
        onChange: (value) => {
          setCellStyle({ fontColor: value });
        },
      },
      h<IconProps>(Icon, { name: 'fontColor' }),
    ),
    h<ColorPickerProps>(
      ColorPicker,
      {
        color: fillColor,
        style: 'margin-left:8px',
        onChange: (value) => {
          setCellStyle({ fillColor: value });
        },
      },
      h(FillColorIcon, {}),
    ),
    h(Github, {}),
  );
};

ToolbarContainer.displayName = 'ToolbarContainer';
ToolbarContainer.onceMount = () => {
  const list = FONT_FAMILY_LIST.map((v) => {
    const disabled = !isSupportFontFamily(v);
    return { label: v, value: v, disabled };
  });
  globalStore.set({ fontFamilyList: list });
};
