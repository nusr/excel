import React, { useSyncExternalStore, useMemo, memo, useCallback } from 'react';
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
import { fontFamilyStore, styleStore, coreStore } from '@/containers/store';
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

const selectStyle = {
  width: 140,
};
const wrapTextStyle = {
  minWidth: 80,
};

export const ToolbarContainer: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const coreData = useSyncExternalStore(
      coreStore.subscribe,
      coreStore.getSnapshot,
    );
    const cellStyle = useSyncExternalStore(
      styleStore.subscribe,
      styleStore.getSnapshot,
    );
    const fontFamilyList = useSyncExternalStore(
      fontFamilyStore.subscribe,
      fontFamilyStore.getSnapshot,
    );
    const fillStyle = useMemo(() => {
      return { color: cellStyle.fillColor };
    }, [cellStyle.fillColor]);
    const fontStyle = useMemo(() => {
      return { color: cellStyle.fontColor };
    }, [cellStyle.fontColor]);
    const getItemStyle = useCallback(
      (value: string | number): React.CSSProperties => {
        return {
          fontFamily: String(value),
          fontSize: '16px',
        };
      },
      [],
    );
    const setCellStyle = (value: Partial<StyleType>) => {
      controller.updateCellStyle(value, [controller.getActiveCell()]);
    };
    const handleFontFamilyChange = useCallback((value: string | number) => {
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
    }, []);
    const undo = useCallback(() => {
      controller.undo();
    }, []);
    const redo = useCallback(() => {
      controller.redo();
    }, []);
    const copy = useCallback(() => {
      controller.copy();
    }, []);
    const cut = useCallback(() => {
      controller.cut();
    }, []);
    const paste = useCallback(() => {
      controller.paste();
    }, []);
    const setFontSize = useCallback((value: string | number) => {
      controller.updateCellStyle({ fontSize: Number(value) }, [
        controller.getActiveCell(),
      ]);
    }, []);
    const toggleBold = useCallback(() => {
      controller.updateCellStyle({ isBold: !cellStyle.isBold }, [
        controller.getActiveCell(),
      ]);
    }, [cellStyle.isBold]);
    const toggleItalic = useCallback(() => {
      controller.updateCellStyle({ isItalic: !cellStyle.isItalic }, [
        controller.getActiveCell(),
      ]);
    }, [cellStyle.isItalic]);
    const toggleStrike = useCallback(() => {
      controller.updateCellStyle({ isStrike: !cellStyle.isStrike }, [
        controller.getActiveCell(),
      ]);
    }, [cellStyle.isStrike]);
    const setUnderline = useCallback((value: string | number) => {
      controller.updateCellStyle({ underline: Number(value) }, [
        controller.getActiveCell(),
      ]);
    }, []);
    const setFillColor = useCallback((value: string) => {
      controller.updateCellStyle({ fillColor: value }, [
        controller.getActiveCell(),
      ]);
    }, []);
    const setFontColor = useCallback((value: string) => {
      controller.updateCellStyle({ fontColor: value }, [
        controller.getActiveCell(),
      ]);
    }, []);
    const toggleWrapText = useCallback(() => {
      controller.updateCellStyle({ isWrapText: !cellStyle.isWrapText }, [
        controller.getActiveCell(),
      ]);
    }, [cellStyle.isWrapText]);
    return (
      <div className={styles['toolbar-wrapper']} data-testid="toolbar">
        <Button
          disabled={!coreData.canUndo}
          onClick={undo}
          testId="toolbar-undo"
          title="undo"
        >
          <Icon name="undo" />
        </Button>
        <Button
          disabled={!coreData.canRedo}
          onClick={redo}
          testId="toolbar-redo"
          title="redo"
        >
          <Icon name="redo" />
        </Button>
        <Button onClick={copy} testId="toolbar-copy">
          {$('copy')}
        </Button>
        <Button onClick={cut} testId="toolbar-cut">
          {$('cut')}
        </Button>
        <Button onClick={paste} testId="toolbar-paste">
          {$('paste')}
        </Button>

        <Select
          data={fontFamilyList}
          value={cellStyle.fontFamily}
          style={selectStyle}
          getItemStyle={getItemStyle}
          onChange={handleFontFamilyChange}
        />
        <Select
          data={FONT_SIZE_LIST}
          value={cellStyle.fontSize}
          onChange={setFontSize}
        />
        <Button
          active={cellStyle.isBold}
          onClick={toggleBold}
          testId="toolbar-bold"
          title="Bold"
        >
          <span className={styles.bold}>B</span>
        </Button>
        <Button
          active={cellStyle.isItalic}
          onClick={toggleItalic}
          testId="toolbar-italic"
          title="Italic"
        >
          <span className={styles.italic}>I</span>
        </Button>
        <Button
          active={cellStyle.isStrike}
          onClick={toggleStrike}
          testId="toolbar-strike"
          title="Strike"
        >
          <span className={styles.strike}>A</span>
        </Button>
        <Select
          data={underlineList}
          value={cellStyle.underline}
          style={selectStyle}
          title="Underline"
          onChange={setUnderline}
        />
        <ColorPicker
          key="fill-color"
          color={cellStyle.fillColor}
          onChange={setFillColor}
        >
          <Button style={fillStyle}>
            <FillColorIcon />
          </Button>
        </ColorPicker>

        <ColorPicker
          key="font-color"
          color={cellStyle.fontColor}
          onChange={setFontColor}
        >
          <Button style={fontStyle}>
            <Icon name="fontColor" />
          </Button>
        </ColorPicker>
        <Button
          active={cellStyle.isWrapText}
          onClick={toggleWrapText}
          testId="toolbar-wrap-text"
          style={wrapTextStyle}
        >
          {$('wrap-text')}
        </Button>
        <InsertFloatingPicture controller={controller} />
        {isMobile() ? null : <InsertChart controller={controller} />}
        {/* <Button
        active={cellStyle.isMergeCell}
        onClick={() => {
          const { range, isMerged } = controller.getActiveRange();
          if (isMerged) {
            controller.deleteMergeCell(range);
          } else {
            controller.addMergeCell(range);
          }
        }}
        testId="toolbar-merge-cells"
        style={wrapTextStyle}
      >
        Merge Cells
      </Button> */}
        <Github />
      </div>
    );
  },
);

ToolbarContainer.displayName = 'ToolbarContainer';
