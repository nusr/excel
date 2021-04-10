import React, { memo, useMemo, useCallback, useRef } from "react";
import { pick, isEmpty } from "@/lodash";
import { CellEditorContent } from "@/components";
import { QueryCellResult } from "@/types";
import { useSelector, useDispatch, useController } from "@/store";
import {
  DEFAULT_FONT_COLOR,
  makeFont,
  DEFAULT_FONT_SIZE,
  containersLog,
} from "@/util";

function getEditorStyle(style: QueryCellResult["style"]): React.CSSProperties {
  if (isEmpty(style)) {
    return {};
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
}

export const CellEditorContainer = memo(() => {
  const dispatch = useDispatch();
  const controller = useController();
  const inputRef = useRef<HTMLInputElement>(null);
  const { activeCell, editCellValue, isCellEditing } = useSelector([
    "activeCell",
    "editCellValue",
    "isCellEditing",
  ]);
  console.log("isCellEditing", isCellEditing);
  const style = useMemo(() => {
    const otherStyle = getEditorStyle(activeCell.style);
    const temp: React.CSSProperties = pick(activeCell, [
      "top",
      "left",
      "width",
      "height",
    ]);
    return { ...temp, ...otherStyle };
  }, [activeCell]);

  const initValue = useMemo(() => {
    const temp = String(activeCell.value || "");
    return temp;
  }, [activeCell]);

  const onFocus = useCallback(() => {
    const editCellValue =
      (activeCell.formula ? `=${activeCell.formula}` : "") ||
      String(activeCell.value || "");
    dispatch({
      type: "BATCH",
      payload: { isCellEditing: true, editCellValue },
    });
  }, [activeCell, dispatch]);
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      dispatch({ type: "CHANGE_Edit_CELL_VALUE", payload: value });
    },
    [dispatch]
  );

  const setCellValue = useCallback(() => {
    controller.setCellValue(editCellValue);
    dispatch({
      type: "BATCH",
      payload: { isCellEditing: false, editCellValue: "" },
    });
    inputRef.current?.blur();
  }, [controller, editCellValue, dispatch]);
  const onInputEnter = useCallback(() => {
    inputRef.current?.blur();
    controller.setActiveCell(activeCell.row + 1, activeCell.col);
  }, [activeCell, controller]);
  const onInputTab = useCallback(() => {
    inputRef.current?.blur();
    controller.setActiveCell(activeCell.row, activeCell.col + 1);
  }, [activeCell, controller]);
  const onBlur = useCallback(() => {
    containersLog("onBlur");
    setCellValue();
  }, [setCellValue]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;
      if (key === "Enter") {
        onInputEnter();
      } else if (key === "Tab") {
        onInputTab();
      }
    },
    [onInputEnter, onInputTab]
  );

  return (
    <CellEditorContent
      value={isCellEditing ? editCellValue : initValue}
      style={style}
      ref={inputRef}
      id="cell-editor"
      onFocus={onFocus}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  );
});

CellEditorContainer.displayName = "CellEditorContainer";
