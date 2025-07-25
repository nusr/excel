import React, { useMemo, memo, useCallback } from 'react';
import {
  Icon,
  Button,
  Select,
  FillColorIcon,
  ColorPicker,
  SelectList,
} from '../../components';
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
    const getItemStyle = useCallback(
      (value: string | number): React.CSSProperties => {
        return {
          fontFamily: String(value),
        };
      },
      [],
    );
    const handleFontFamilyChange = useCallback((value: string | number) => {
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
    const setFontSize = useCallback((value: string | number) => {
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
    const setUnderline = useCallback((value: string | number) => {
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
    const setFillColor = useCallback((value: string) => {
      controller.updateCellStyle(
        { fillColor: value },
        controller.getActiveRange().range,
      );
    }, []);
    const setFontColor = useCallback((value: string) => {
      controller.updateCellStyle(
        { fontColor: value },
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
        <Button
          disabled={!canUndo}
          onClick={undo}
          testId="toolbar-undo"
          title="Undo"
          className={styles['icon-center']}
        >
          <Icon name="undo" />
        </Button>
        <Button
          disabled={!canRedo}
          onClick={redo}
          testId="toolbar-redo"
          title="Redo"
          className={styles['icon-center']}
        >
          <Icon name="redo" />
        </Button>
        <Button onClick={copy} testId="toolbar-copy" title="Copy">
          {i18n.t('copy')}
        </Button>
        <Button onClick={cut} testId="toolbar-cut" title="Cut">
          {i18n.t('cut')}
        </Button>
        <Button onClick={paste} testId="toolbar-paste" title="Paste">
          {i18n.t('paste')}
        </Button>

        <Select
          data={fontFamilyList}
          value={cellStyle.fontFamily}
          getItemStyle={getItemStyle}
          onChange={handleFontFamilyChange}
          testId="toolbar-font-family"
          className={styles.fontFamily}
        />
        <Select
          data={FONT_SIZE_LIST}
          value={cellStyle.fontSize}
          onChange={setFontSize}
          testId="toolbar-font-size"
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
          data={underlineOptionList}
          value={cellStyle.underline}
          title="Underline"
          onChange={setUnderline}
          testId="toolbar-underline"
        />
        <BorderToolBar />
        <ColorPicker
          key="fill-color"
          color={cellStyle.fillColor}
          onChange={setFillColor}
          testId="toolbar-fill-color"
        >
          <Button
            style={fillStyle}
            testId="toolbar-fill-color"
            className={styles['icon-center']}
            title="Fill Color"
          >
            <FillColorIcon />
          </Button>
        </ColorPicker>

        <ColorPicker
          key="font-color"
          color={cellStyle.fontColor}
          onChange={setFontColor}
          testId="toolbar-font-color"
        >
          <Button
            style={fontStyle}
            testId="toolbar-font-color"
            className={styles['icon-center']}
            title="Font Color"
          >
            <Icon name="fontColor" />
          </Button>
        </ColorPicker>
        <Button
          active={cellStyle.verticalAlign === EVerticalAlign.TOP}
          onClick={verticalTop}
          testId="toolbar-vertical-top"
          className={styles['icon-center']}
          title="Top Align"
        >
          <Icon name="verticalTop" />
        </Button>
        <Button
          active={cellStyle.verticalAlign === EVerticalAlign.MIDDLE}
          onClick={verticalMiddle}
          testId="toolbar-vertical-middle"
          className={styles['icon-center']}
          title="Middle Align"
        >
          <Icon name="verticalMiddle" />
        </Button>
        <Button
          active={cellStyle.verticalAlign === EVerticalAlign.BOTTOM}
          onClick={verticalBottom}
          testId="toolbar-vertical-bottom"
          className={styles['icon-center']}
          title="Bottom Align"
        >
          <Icon name="verticalBottom" />
        </Button>
        <Button
          active={cellStyle.horizontalAlign === EHorizontalAlign.LEFT}
          onClick={horizontalLeft}
          testId="toolbar-horizontal-left"
          className={styles['icon-center']}
          title="Align Text Left"
        >
          <Icon name="horizontalLeft" />
        </Button>
        <Button
          active={cellStyle.horizontalAlign === EHorizontalAlign.CENTER}
          onClick={horizontalCenter}
          testId="toolbar-horizontal-center"
          className={styles['icon-center']}
          title="Align Text Center"
        >
          <Icon name="horizontalCenter" />
        </Button>
        <Button
          active={cellStyle.horizontalAlign === EHorizontalAlign.RIGHT}
          onClick={horizontalRight}
          testId="toolbar-horizontal-right"
          className={styles['icon-center']}
          title="Align Text Right"
        >
          <Icon name="horizontalRight" />
        </Button>
        <Button
          active={cellStyle.isWrapText}
          onClick={toggleWrapText}
          testId="toolbar-wrap-text"
          className={styles['wrap-text']}
          title="Wrap Text"
        >
          {i18n.t('wrap-text')}
        </Button>
        <SelectList
          data={mergeOptionList}
          value={cellStyle.mergeType}
          onChange={handleMergeCell}
          className={styles['merge-cell']}
          testId="toolbar-merge-cell-select"
        >
          <Button
            active={cellStyle.isMergeCell}
            onClick={toggleMergeCell}
            testId="toolbar-merge-cell"
            className={styles['merge-cell-button']}
            type="plain"
            title="Merge And Center"
          >
            {i18n.t('merge-and-center')}
          </Button>
        </SelectList>
        <SelectList
          data={numberFormatOptionList}
          value={numberFormatValue}
          onChange={handleNumberFormat}
          className={styles['number-format']}
          testId="toolbar-number-format"
        >
          <div
            className={styles['number-format-value']}
            data-testid="toolbar-number-format-value"
          >
            {numberFormatLabel}
          </div>
        </SelectList>
        <Button
          active={isFilter}
          onClick={handleFilter}
          testId="toolbar-filter"
          className={styles['wrap-text']}
          title="Filter"
        >
          {i18n.t('filter')}
        </Button>
        <InsertFloatingPicture />
        <InsertChart />
        {children}
      </div>
    );
  });

ToolbarContainer.displayName = 'ToolbarContainer';

export default ToolbarContainer;
