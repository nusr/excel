import React, { memo, useCallback, useMemo } from "react";
import { TextEditor } from "@/components";
import { useSelector, useDispatch } from "@/store";
import { controller } from "@/controller";
import { isEmpty } from "lodash";
import { DEFAULT_FONT_COLOR, makeFont, DEFAULT_FONT_SIZE } from "@/util";

type Props = {
  isFormulaBar?: boolean;
};

export const TextEditorContainer = memo<Props>(({ isFormulaBar = false }) => {
  const { activeCell, isCellEditing, editCellValue } = useSelector([
    "activeCell",
    "isCellEditing",
    "editCellValue",
  ]);
  const displayValue = useMemo(() => {
    if (isCellEditing) {
      return editCellValue;
    } else {
      const temp = String(activeCell.value || "");
      if (isFormulaBar) {
        return (activeCell.formula ? `=${activeCell.formula}` : "") || temp;
      }
      return temp;
    }
  }, [isCellEditing, isFormulaBar, activeCell, editCellValue]);
  const style = useMemo(() => {
    const { style } = activeCell;
    if (isFormulaBar || isEmpty(style)) {
      return undefined;
    }
    const font = makeFont(
      style?.isItalic ? "italic" : "normal",
      style?.isBold ? "bold" : "500",
      style?.fontSize || DEFAULT_FONT_SIZE,
      style?.fontFamily
    );
    return {
      backgroundColor: style?.fillColor || "inherit",
      color: style?.fontColor || DEFAULT_FONT_COLOR,
      font,
    };
  }, [activeCell, isFormulaBar]);
  const dispatch = useDispatch();

  const onInputEnter = useCallback(() => {
    controller.setCellValue(editCellValue);
    controller.quitEditing();
    controller.setActiveCell(activeCell.row + 1, activeCell.col);
  }, [activeCell, editCellValue]);
  const onInputTab = useCallback(() => {
    controller.setCellValue(editCellValue);
    controller.quitEditing();
    controller.setActiveCell(activeCell.row, activeCell.col + 1);
  }, [activeCell, editCellValue]);
  const onBlur = useCallback(() => {
    // controller.setCellValue(activeCell.row, activeCell.col, editCellValue);
    // controller.quitEditing();
    // dispatch({ type: "QUIT_EDITING" });
  }, []);
  const onChange = useCallback(
    (event) => {
      const { value } = event.currentTarget;
      dispatch({ type: "CHANGE_Edit_CELL_VALUE", payload: value });
    },
    [dispatch]
  );
  return (
    <TextEditor
      value={displayValue}
      style={style}
      isCellEditing={isCellEditing}
      onBlur={onBlur}
      onInputEnter={onInputEnter}
      onInputTab={onInputTab}
      onChange={onChange}
    />
  );
});

TextEditorContainer.displayName = "TextEditorContainer";
