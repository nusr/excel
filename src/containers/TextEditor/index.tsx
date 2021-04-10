import React, { memo, useCallback, useMemo } from "react";
import { TextEditor } from "@/components";
import { useSelector, useDispatch, useController } from "@/store";
import { isEmpty } from "@/lodash";
import {
  DEFAULT_FONT_COLOR,
  makeFont,
  DEFAULT_FONT_SIZE,
  containersLog,
} from "@/util";

type Props = {
  isFormulaBar?: boolean;
};

export const TextEditorContainer = memo<Props>((props) => {
  const { isFormulaBar = false } = props;
  const controller = useController();
  const { activeCell, isCellEditing, editCellValue } = useSelector([
    "activeCell",
    "isCellEditing",
    "editCellValue",
  ]);

  const initValue = useMemo(() => {
    const temp = String(activeCell.value || "");
    if (isFormulaBar) {
      return (activeCell.formula ? `=${activeCell.formula}` : "") || temp;
    }
    return temp;
  }, [isFormulaBar, activeCell]);

  const displayValue = useMemo(() => {
    if (isCellEditing) {
      return editCellValue;
    } else {
      return initValue;
    }
  }, [isCellEditing, initValue, editCellValue]);
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
    controller.setActiveCell(activeCell.row + 1, activeCell.col);
  }, [activeCell, editCellValue, controller]);
  const onInputTab = useCallback(() => {
    controller.setCellValue(editCellValue);
    controller.setActiveCell(activeCell.row, activeCell.col + 1);
  }, [activeCell, editCellValue, controller]);
  const onBlur = useCallback(() => {
    if (controller.isCellEditing) {
      console.log("blur", activeCell, editCellValue);
      controller.setCellValue(editCellValue);
      dispatch({ type: "CHANGE_Edit_CELL_VALUE", payload: "" });
    }
  }, [controller, editCellValue, activeCell, dispatch]);
  const onChange = useCallback(
    (event) => {
      const { value } = event.currentTarget;
      dispatch({ type: "CHANGE_Edit_CELL_VALUE", payload: value });
    },
    [dispatch]
  );
  const onFocus = useCallback(() => {
    if (controller.isCellEditing) {
      return;
    }
    containersLog("focus", initValue);
    dispatch({ type: "CHANGE_Edit_CELL_VALUE", payload: initValue });
  }, [initValue, dispatch, controller]);
  return (
    <TextEditor
      value={displayValue}
      style={style}
      isCellEditing={isCellEditing}
      onBlur={onBlur}
      onFocus={onFocus}
      onInputEnter={onInputEnter}
      onInputTab={onInputTab}
      onChange={onChange}
    />
  );
});

TextEditorContainer.displayName = "TextEditorContainer";
