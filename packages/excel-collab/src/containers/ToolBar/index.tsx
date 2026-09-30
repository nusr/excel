import React, { useMemo, memo, useCallback, Key } from 'react';
import { SelectList } from '../../components';
import {
  FONT_SIZE_LIST,
  QUERY_ALL_LOCAL_FONT,
  LOCAL_FONT_KEY,
} from '../../util';
import {
  EUnderLine,
  OptionItem,
  EHorizontalAlign,
  EVerticalAlign,
} from '../../types';
import styles from './index.module.css';
import { useStyleStore, useCoreStore, useExcel } from '../../containers/store';
import { InsertFloatingPicture, InsertChart } from '../FloatElement/Toolbar';
import i18n from '../../i18n';
import { BorderToolBar } from './Border';
import { isSupportFontFamily } from '../canvas/isSupportFontFamily';
import {
  numberFormatOptionList,
  underlineOptionList,
  mergeOptionList,
} from './constant';
import { Select, SelectItem } from '../../component/Select';
import { ColorPicker } from '../ColorPicker';
import { ToggleButton } from '../../component/ToggleButton';
import { Button } from '../../component/Button';
import {
  ArrowUpToLine,
  Baseline,
  PaintBucket,
  Redo,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  Undo,
  ArrowDownToLine,
  ChevronsDownUp,
} from 'lucide-react';

export const ToolbarContainer: React.FunctionComponent<React.PropsWithChildren> =
  memo(({ children }) => {
    const { controller } = useExcel();
    const canRedo = useCoreStore((s) => s.canRedo);
    const canUndo = useCoreStore((s) => s.canUndo);
    const isFilter = useCoreStore((s) => s.isFilter);
    const fontFamilies = useCoreStore((s) => s.fontFamilies);
    const setFontFamilies = useCoreStore((s) => s.setFontFamilies);
    const cellStyle = useStyleStore();

    const fontFamilyList = useCoreStore((s) => s.fontFamilies);

    const fillStyle = useMemo(() => {
      return { color: cellStyle.fillColor };
    }, [cellStyle.fillColor]);
    const fontStyle = useMemo(() => {
      return { color: cellStyle.fontColor };
    }, [cellStyle.fontColor]);
    const [numberFormatLabel, numberFormatValue] = useMemo(() => {
      let item: OptionItem = numberFormatOptionList[0];
      if (cellStyle.numberFormat) {
        const t = numberFormatOptionList.find(
          (v) => v.value === cellStyle.numberFormat,
        );
        if (t) {
          item = t;
        } else {
          item = numberFormatOptionList[numberFormatOptionList.length - 1];
        }
      }
      return [item.label, String(item.value)];
    }, [cellStyle.numberFormat]);

    const handleFontFamilyChange = useCallback((value: Key | null) => {
      if (!value) {
        return;
      }
      if (
        String(value) === QUERY_ALL_LOCAL_FONT &&
        typeof window.queryLocalFonts === 'function'
      ) {
        window.queryLocalFonts().then((list) => {
          let fontList = list.map((v) => v.fullName);
          fontList = Array.from(new Set(fontList)).filter((v) =>
            isSupportFontFamily(v),
          );
          fontList.sort((a, b) => a.localeCompare(b));
          const l = fontList.map((v) => ({
            label: v,
            value: v,
            disabled: false,
          }));
          if (fontList.length > 0) {
            setFontFamilies(l);
            localStorage.setItem(LOCAL_FONT_KEY, JSON.stringify(fontList));
          } else {
            setFontFamilies(
              fontFamilies.filter((v) => v.value !== QUERY_ALL_LOCAL_FONT),
            );
          }
        });
      } else {
        controller.updateCellStyle(
          { fontFamily: String(value) },
          controller.getActiveRange().range,
        );
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
    const setFontSize = useCallback((value: Key | null) => {
      controller.updateCellStyle(
        { fontSize: Number(value) },
        controller.getActiveRange().range,
      );
    }, []);
    const toggleBold = useCallback(() => {
      controller.updateCellStyle(
        { isBold: !cellStyle.isBold },
        controller.getActiveRange().range,
      );
    }, [cellStyle.isBold]);
    const toggleItalic = useCallback(() => {
      controller.updateCellStyle(
        { isItalic: !cellStyle.isItalic },
        controller.getActiveRange().range,
      );
    }, [cellStyle.isItalic]);
    const toggleStrike = useCallback(() => {
      controller.updateCellStyle(
        { isStrike: !cellStyle.isStrike },
        controller.getActiveRange().range,
      );
    }, [cellStyle.isStrike]);
    const setUnderline = useCallback((value: Key | null) => {
      const t = Number(value);
      let underline = EUnderLine.NONE;
      if (t === EUnderLine.SINGLE) {
        underline = EUnderLine.SINGLE;
      } else if (t === EUnderLine.DOUBLE) {
        underline = EUnderLine.DOUBLE;
      }
      controller.updateCellStyle(
        { underline },
        controller.getActiveRange().range,
      );
    }, []);
    const setFillColor = useCallback((value: unknown) => {
      controller.updateCellStyle(
        { fillColor: String(value) },
        controller.getActiveRange().range,
      );
    }, []);
    const setFontColor = useCallback((value: unknown) => {
      controller.updateCellStyle(
        { fontColor: String(value) },
        controller.getActiveRange().range,
      );
    }, []);
    const toggleWrapText = useCallback(() => {
      controller.updateCellStyle(
        { isWrapText: !cellStyle.isWrapText },
        controller.getActiveRange().range,
      );
    }, [cellStyle.isWrapText]);
    const toggleMergeCell = useCallback(() => {
      const { range, isMerged } = controller.getActiveRange();
      if (isMerged) {
        controller.deleteMergeCell(range);
      } else {
        controller.addMergeCell(range);
      }
    }, []);
    const handleMergeCell = useCallback((value: string) => {
      if (!value) {
        return;
      }
      const { range, isMerged } = controller.getActiveRange();
      if (isMerged) {
        controller.deleteMergeCell(range);
      } else {
        controller.addMergeCell(range, Number(value));
      }
    }, []);
    const handleNumberFormat = useCallback((value: string) => {
      if (!value) {
        return;
      }
      controller.updateCellStyle(
        { numberFormat: value },
        controller.getActiveRange().range,
      );
    }, []);
    const horizontalLeft = useCallback(() => {
      controller.updateCellStyle(
        { horizontalAlign: EHorizontalAlign.LEFT },
        controller.getActiveRange().range,
      );
    }, []);
    const horizontalCenter = useCallback(() => {
      controller.updateCellStyle(
        { horizontalAlign: EHorizontalAlign.CENTER },
        controller.getActiveRange().range,
      );
    }, []);
    const horizontalRight = useCallback(() => {
      controller.updateCellStyle(
        { horizontalAlign: EHorizontalAlign.RIGHT },
        controller.getActiveRange().range,
      );
    }, []);

    const verticalTop = useCallback(() => {
      controller.updateCellStyle(
        { verticalAlign: EVerticalAlign.TOP },
        controller.getActiveRange().range,
      );
    }, []);
    const verticalMiddle = useCallback(() => {
      controller.updateCellStyle(
        { verticalAlign: EVerticalAlign.MIDDLE },
        controller.getActiveRange().range,
      );
    }, []);
    const verticalBottom = useCallback(() => {
      controller.updateCellStyle(
        { verticalAlign: EVerticalAlign.BOTTOM },
        controller.getActiveRange().range,
      );
    }, []);
    const handleFilter = useCallback(() => {
      const filter = controller.getFilter();
      if (filter) {
        controller.deleteFilter();
      } else {
        controller.addFilter(controller.getActiveRange().range);
      }
    }, []);
    return (
      <div className={styles['toolbar-wrapper']} data-testid="toolbar">
        <ToggleButton
          isDisabled={!canUndo}
          onClick={undo}
          data-testid="toolbar-undo"
          aria-label="Undo"
        >
          <Undo />
        </ToggleButton>
        <ToggleButton
          isDisabled={!canRedo}
          onClick={redo}
          aria-label="Redo"
          data-testid="toolbar-redo"
        >
          <Redo />
        </ToggleButton>
        <ToggleButton
          onClick={copy}
          data-testid="toolbar-copy"
          aria-label="Copy"
        >
          {i18n.t('copy')}
        </ToggleButton>
        <ToggleButton onClick={cut} data-testid="toolbar-cut" aria-label="Cut">
          {i18n.t('cut')}
        </ToggleButton>
        <ToggleButton
          onClick={paste}
          data-testid="toolbar-paste"
          aria-label="Paste"
        >
          {i18n.t('paste')}
        </ToggleButton>

        <Select
          aria-label="Select font family"
          data-testid="toolbar-font-family"
          value={cellStyle.fontFamily}
          onChange={handleFontFamilyChange}
        >
          {fontFamilyList.map((item) => (
            <SelectItem
              key={item.value}
              id={item.value}
              aria-label={item.label}
              style={{ fontFamily: String(item.value) }}
              isDisabled={item.disabled}
            >
              {item.label}
            </SelectItem>
          ))}
        </Select>

        <Select
          aria-label="Select font size"
          data-testid="toolbar-font-size"
          value={cellStyle.fontSize}
          onChange={setFontSize}
        >
          {FONT_SIZE_LIST.map((item) => (
            <SelectItem key={item} id={item} aria-label={String(item)}>
              {item}
            </SelectItem>
          ))}
        </Select>

        <ToggleButton
          isSelected={cellStyle.isBold}
          onClick={toggleBold}
          data-testid="toolbar-bold"
          aria-label="Bold"
        >
          <span className={styles.bold}>B</span>
        </ToggleButton>
        <ToggleButton
          isSelected={cellStyle.isItalic}
          onClick={toggleItalic}
          data-testid="toolbar-italic"
          aria-label="Italic"
        >
          <span className={styles.italic}>I</span>
        </ToggleButton>
        <ToggleButton
          isSelected={cellStyle.isStrike}
          onClick={toggleStrike}
          data-testid="toolbar-strike"
          aria-label="Strike"
        >
          <span className={styles.strike}>A</span>
        </ToggleButton>

        <Select
          aria-label="Select underline"
          data-testid="toolbar-underline"
          value={cellStyle.underline}
          onChange={setUnderline}
        >
          {underlineOptionList.map((item) => (
            <SelectItem
              key={item.value}
              id={item.value}
              aria-label={item.label}
            >
              {item.label}
            </SelectItem>
          ))}
        </Select>

        <BorderToolBar />
        <ColorPicker
          key="fill-color"
          value={cellStyle.fillColor}
          onChange={setFillColor}
          data-testid="toolbar-fill-color-picker"
        >
          <Button
            style={fillStyle}
            data-testid="toolbar-fill-color"
            aria-label="Fill Color"
          >
            <PaintBucket />
          </Button>
        </ColorPicker>

        <ColorPicker
          key="font-color"
          value={cellStyle.fontColor}
          onChange={setFontColor}
          onReset={() =>
            controller.updateCellStyle(
              { fontColor: '' },
              controller.getActiveRange().range,
            )
          }
          data-testid="toolbar-font-color-picker"
        >
          <Button
            style={fontStyle}
            data-testid="toolbar-font-color"
            aria-label="Font Color"
          >
            <Baseline />
          </Button>
        </ColorPicker>
        <ToggleButton
          isSelected={cellStyle.verticalAlign === EVerticalAlign.TOP}
          onClick={verticalTop}
          data-testid="toolbar-vertical-top"
          aria-label="Top Align"
        >
          <ArrowUpToLine />
        </ToggleButton>
        <ToggleButton
          isSelected={cellStyle.verticalAlign === EVerticalAlign.MIDDLE}
          onClick={verticalMiddle}
          data-testid="toolbar-vertical-middle"
          aria-label="Middle Align"
        >
          <ChevronsDownUp />
        </ToggleButton>
        <ToggleButton
          isSelected={cellStyle.verticalAlign === EVerticalAlign.BOTTOM}
          onClick={verticalBottom}
          data-testid="toolbar-vertical-bottom"
          aria-label="Bottom Align"
        >
          <ArrowDownToLine />
        </ToggleButton>
        <ToggleButton
          isSelected={cellStyle.horizontalAlign === EHorizontalAlign.LEFT}
          onClick={horizontalLeft}
          data-testid="toolbar-horizontal-left"
          aria-label="Align Text Left"
        >
          <TextAlignStart />
        </ToggleButton>
        <ToggleButton
          isSelected={cellStyle.horizontalAlign === EHorizontalAlign.CENTER}
          onClick={horizontalCenter}
          data-testid="toolbar-horizontal-center"
          aria-label="Align Text Center"
        >
          <TextAlignCenter />
        </ToggleButton>
        <ToggleButton
          isSelected={cellStyle.horizontalAlign === EHorizontalAlign.RIGHT}
          onClick={horizontalRight}
          data-testid="toolbar-horizontal-right"
          aria-label="Align Text Right"
        >
          <TextAlignEnd />
        </ToggleButton>
        <ToggleButton
          isSelected={cellStyle.isWrapText}
          onClick={toggleWrapText}
          data-testid="toolbar-wrap-text"
          className={styles['wrap-text']}
          aria-label="Wrap Text"
        >
          {i18n.t('wrap-text')}
        </ToggleButton>
        <SelectList
          data={mergeOptionList}
          value={cellStyle.mergeType}
          onChange={handleMergeCell}
          testId="toolbar-merge-cell-select"
        >
          <ToggleButton
            isSelected={cellStyle.isMergeCell}
            onClick={toggleMergeCell}
            data-testid="toolbar-merge-cell"
            className={styles['merge-cell-button']}
            variant="quiet"
            aria-label="Merge And Center"
          >
            {i18n.t('merge-and-center')}
          </ToggleButton>
        </SelectList>
        <SelectList
          data={numberFormatOptionList}
          value={numberFormatValue}
          onChange={handleNumberFormat}
          testId="toolbar-number-format"
        >
          <div data-testid="toolbar-number-format-value">
            {numberFormatLabel}
          </div>
        </SelectList>
        <ToggleButton
          isSelected={isFilter}
          onClick={handleFilter}
          data-testid="toolbar-filter"
          className={styles['wrap-text']}
          aria-label="Filter"
        >
          {i18n.t('filter')}
        </ToggleButton>
        <InsertFloatingPicture />
        <InsertChart />
        {children}
      </div>
    );
  });

ToolbarContainer.displayName = 'ToolbarContainer';

export default ToolbarContainer;
