import React, { useSyncExternalStore } from 'react';
import {
  Icon,
  Button,
  Github,
  Select,
  FillColorIcon,
  ColorPicker,
} from '../components';
import {
  FONT_SIZE_LIST,
  QUERY_ALL_LOCAL_FONT,
  LOCAL_FONT_KEY,
  isSupportFontFamily,
  isMobile,
} from '@/util';
import { StyleType, EUnderLine, OptionItem, IController } from '@/types';
import styles from './index.module.css';
import {
  activeCellStore,
  fontFamilyStore,
  coreStore,
} from '@/containers/store';
import { InsertFloatingPicture, InsertChart } from '../FloatElement';
import { $ } from '@/i18n';

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
  const { canRedo, canUndo } = useSyncExternalStore(
    coreStore.subscribe,
    coreStore.getSnapshot,
  );
  const activeCell = useSyncExternalStore(
    activeCellStore.subscribe,
    activeCellStore.getSnapshot,
  );
  const fontFamilyList = useSyncExternalStore(
    fontFamilyStore.subscribe,
    fontFamilyStore.getSnapshot,
  );
  const getItemStyle = (value: string | number): React.CSSProperties => {
    return {
      fontFamily: String(value),
      fontSize: '16px',
    };
  };
  const setCellStyle = (value: Partial<StyleType>) => {
    controller.updateCellStyle(value, [controller.getActiveCell()]);
  };
  const {
    isBold,
    isItalic,
    isStrike,
    fontSize,
    fontColor = '',
    fillColor = '',
    isWrapText,
    underline,
    fontFamily,
  } = activeCell;
  const handleFontFamilyChange = (value: string | number) => {
    const t = String(value);
    const queryLocalFonts = (window as any).queryLocalFonts;
    if (t === QUERY_ALL_LOCAL_FONT && typeof queryLocalFonts === 'function') {
      queryLocalFonts().then(
        (
          list: Array<{
            fullName: string;
            family: string;
            postscriptName: string;
            style: string;
          }>,
        ) => {
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
        },
      );
    } else {
      setCellStyle({ fontFamily: String(value) });
    }
  };
  return (
    <div className={styles['toolbar-wrapper']} data-testid="toolbar">
      <Button
        disabled={!canUndo}
        onClick={() => controller.undo()}
        testId="toolbar-undo"
        title="undo"
      >
        <Icon name="undo" />
      </Button>
      <Button
        disabled={!canRedo}
        onClick={() => controller.redo()}
        testId="toolbar-redo"
        title="redo"
      >
        <Icon name="redo" />
      </Button>
      <Button onClick={() => controller.copy()} testId="toolbar-copy">
        {$('copy')}
      </Button>
      <Button onClick={() => controller.cut()} testId="toolbar-cut">
        {$('cut')}
      </Button>
      <Button onClick={() => controller.paste()} testId="toolbar-paste">
        {$('paste')}
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
        <span style={{ fontWeight: 'bold' }}>B</span>
      </Button>
      <Button
        active={isItalic}
        onClick={() => setCellStyle({ isItalic: !isItalic })}
        testId="toolbar-italic"
        title="Italic"
      >
        <span style={{ fontStyle: 'italic' }}>I</span>
      </Button>
      <Button
        active={isStrike}
        onClick={() => setCellStyle({ isStrike: !isStrike })}
        testId="toolbar-strike"
        title="Strike"
      >
        <span style={{ textDecorationLine: 'line-through' }}>A</span>
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
        <Button style={{ color: fillColor }}>
          <FillColorIcon />
        </Button>
      </ColorPicker>

      <ColorPicker
        key="font-color"
        color={fontColor}
        onChange={(value) => setCellStyle({ fontColor: value })}
      >
        <Button style={{ color: fontColor }}>
          <Icon name="fontColor" />
        </Button>
      </ColorPicker>
      <Button
        active={isWrapText}
        onClick={() => setCellStyle({ isWrapText: !isWrapText })}
        testId="toolbar-wrap-text"
        style={{ minWidth: 80 }}
      >
        {$('wrap-text')}
      </Button>
      <InsertFloatingPicture controller={controller} />
      {isMobile() ? null : <InsertChart controller={controller} />}
      {/* <Button
        active={isMergeCell}
        onClick={() => {
          const { range, isMerged } = controller.getActiveRange();
          if (isMerged) {
            controller.deleteMergeCell(range);
          } else {
            controller.addMergeCell(range);
          }
        }}
        testId="toolbar-merge-cells"
        style={{ minWidth: 80 }}
      >
        Merge Cells
      </Button> */}
      <Github />
    </div>
  );
};

ToolbarContainer.displayName = 'ToolbarContainer';
