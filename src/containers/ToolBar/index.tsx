import React, { useSyncExternalStore } from 'react';
import {
  Icon,
  Button,
  ColorPicker,
  Github,
  Select,
  FillColorIcon,
} from '../components';
import {
  FONT_SIZE_LIST,
  QUERY_ALL_LOCAL_FONT,
  LOCAL_FONT_KEY,
  isSupportFontFamily,
} from '@/util';
import { StyleType, EUnderLine, OptionItem, IController } from '@/types';
import styles from './index.module.css';
import { activeCellStore, fontFamilyStore } from '@/containers/store';

interface Props {
  controller: IController;
}

const underlineList: OptionItem[] = [
  {
    value: EUnderLine.NONE,
    label: 'none',
    disabled: false,
  },
  {
    value: EUnderLine.SINGLE,
    label: 'single underline',
    disabled: false,
  },
  {
    value: EUnderLine.DOUBLE,
    label: 'double underline',
    disabled: false,
  },
];

export const ToolbarContainer: React.FunctionComponent<Props> = ({
  controller,
}) => {
  const activeCell = useSyncExternalStore(
    activeCellStore.subscribe,
    activeCellStore.getSnapshot,
  );
  const fontFamilyList = useSyncExternalStore(
    fontFamilyStore.subscribe,
    fontFamilyStore.getSnapshot,
  );
  const getItemStyle = (value: string | number): any => {
    return {
      fontFamily: String(value),
      fontSize: '16px',
    };
  };
  const setCellStyle = (value: Partial<StyleType>) => {
    const cellData = controller.getCell(controller.getActiveCell());
    const styleData = cellData.style || {};
    controller.setCellStyle(Object.assign(styleData, value), [
      controller.getActiveCell(),
    ]);
  };
  const {
    isBold,
    isItalic,
    fontSize,
    fontColor = '',
    fillColor = '',
    isWrapText,
    underline,
    fontFamily,
  } = activeCell;
  const handleFontFamilyChange = (value: string | number) => {
    const t = String(value);
    if (t === QUERY_ALL_LOCAL_FONT) {
      (window as any).queryLocalFonts().then((list: any[]) => {
        let fontList = list.map((v) => v.fullName);
        fontList = Array.from(new Set(fontList)).filter((v) =>
          isSupportFontFamily(v),
        );
        fontList.sort((a, b) => a.localeCompare(b));
        localStorage.setItem(LOCAL_FONT_KEY, JSON.stringify(fontList));
        const l = fontList.map((v) => ({
          label: v,
          value: v,
          disabled: false,
        }));
        fontFamilyStore.setState(l);
      });
    } else {
      setCellStyle({ fontFamily: String(value) });
    }
  };
  return (
    <div className={styles['toolbar-wrapper']} data-testid="toolbar">
      <Button
        disabled={!controller.canUndo}
        onClick={() => controller.undo()}
        testId="toolbar-undo"
        title="undo"
      >
        <Icon name="undo" />
      </Button>
      <Button
        disabled={!controller.canRedo}
        onClick={() => controller.redo()}
        testId="toolbar-redo"
        title="redo"
      >
        <Icon name="redo" />
      </Button>
      <Button onClick={() => controller.copy()} testId="toolbar-copy">
        Copy
      </Button>
      <Button onClick={() => controller.cut()} testId="toolbar-cut">
        Cut
      </Button>
      <Button onClick={() => controller.paste()} testId="toolbar-paste">
        Paste
      </Button>
      <Select
        data={fontFamilyList}
        value={fontFamily}
        style={{
          width: 140,
        }}
        getItemStyle={getItemStyle}
        onChange={handleFontFamilyChange}
      />
      <Select
        data={FONT_SIZE_LIST}
        value={fontSize}
        onChange={(value) => setCellStyle({ fontSize: Number(value) })}
      />
      <Button
        active={isBold}
        onClick={() => setCellStyle({ isBold: !isBold })}
        testId="toolbar-bold"
        title="Bold"
      >
        <Icon name="bold" />
      </Button>
      <Button
        active={isItalic}
        onClick={() => setCellStyle({ isItalic: !isItalic })}
        testId="toolbar-italic"
        title="Italic"
      >
        <Icon name="italic" />
      </Button>
      <Select
        data={underlineList}
        value={underline}
        style={{ width: 130 }}
        title="Underline"
        onChange={(value) => setCellStyle({ underline: Number(value) })}
      />
      <ColorPicker
        key="fill-color"
        color={fillColor}
        onChange={(value) => setCellStyle({ fillColor: value })}
      >
        <FillColorIcon />
      </ColorPicker>
      <ColorPicker
        key="font-color"
        color={fontColor}
        onChange={(value) => setCellStyle({ fontColor: value })}
      >
        <Icon name="fontColor" />
      </ColorPicker>
      <Button
        active={isWrapText}
        onClick={() => setCellStyle({ isWrapText: !isWrapText })}
        testId="toolbar-wrap-text"
        style={{ minWidth: 80 }}
      >
        Wrap Text
      </Button>
      <Github />
    </div>
  );
};

ToolbarContainer.displayName = 'ToolbarContainer';
