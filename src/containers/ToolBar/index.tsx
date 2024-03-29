import React, { useSyncExternalStore, memo } from 'react';
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

export const ToolbarContainer: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const { canRedo, canUndo } = useSyncExternalStore(
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
    const getItemStyle = (value: string | number): React.CSSProperties => {
      return {
        fontFamily: String(value),
        fontSize: '16px',
      };
    };
    const setCellStyle = (value: Partial<StyleType>) => {
      controller.updateCellStyle(value, [controller.getActiveCell()]);
    };
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
          value={cellStyle.fontFamily}
          style={{
            width: 140,
          }}
          getItemStyle={getItemStyle}
          onChange={handleFontFamilyChange}
        />
        <Select
          data={FONT_SIZE_LIST}
          value={cellStyle.fontSize}
          onChange={(value) => setCellStyle({ fontSize: Number(value) })}
        />
        <Button
          active={cellStyle.isBold}
          onClick={() => setCellStyle({ isBold: !cellStyle.isBold })}
          testId="toolbar-bold"
          title="Bold"
        >
          <span style={{ fontWeight: 'bold' }}>B</span>
        </Button>
        <Button
          active={cellStyle.isItalic}
          onClick={() => setCellStyle({ isItalic: !cellStyle.isItalic })}
          testId="toolbar-italic"
          title="Italic"
        >
          <span style={{ fontStyle: 'italic' }}>I</span>
        </Button>
        <Button
          active={cellStyle.isStrike}
          onClick={() => setCellStyle({ isStrike: !cellStyle.isStrike })}
          testId="toolbar-strike"
          title="Strike"
        >
          <span style={{ textDecorationLine: 'line-through' }}>A</span>
        </Button>
        <Select
          data={underlineList}
          value={cellStyle.underline}
          style={{ width: 130 }}
          title="Underline"
          onChange={(value) => setCellStyle({ underline: Number(value) })}
        />
        <ColorPicker
          key="fill-color"
          color={cellStyle.fillColor}
          onChange={(value) => setCellStyle({ fillColor: value })}
        >
          <Button style={{ color: cellStyle.fillColor }}>
            <FillColorIcon />
          </Button>
        </ColorPicker>

        <ColorPicker
          key="font-color"
          color={cellStyle.fontColor}
          onChange={(value) => setCellStyle({ fontColor: value })}
        >
          <Button style={{ color: cellStyle.fontColor }}>
            <Icon name="fontColor" />
          </Button>
        </ColorPicker>
        <Button
          active={cellStyle.isWrapText}
          onClick={() => setCellStyle({ isWrapText: !cellStyle.isWrapText })}
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
  },
);

ToolbarContainer.displayName = 'ToolbarContainer';
