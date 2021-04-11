import React, { memo, useMemo, useCallback, useRef } from "react";
import { useSelector, useController, useDispatch } from "@/store";
import { BaseEditor } from "@/components";
import { containersLog } from "@/util";

export const FormulaEditor = memo(() => {
  const controller = useController();
  const { activeCell, editCellValue, isCellEditing } = useSelector([
    "activeCell",
    "editCellValue",
    "isCellEditing",
  ]);
  const dispatch = useDispatch();
  const inputRef = useRef<HTMLInputElement>(null);
  const initValue = useMemo(() => {
    const temp = String(activeCell.value || "");
    return (activeCell.formula ? `=${activeCell.formula}` : "") || temp;
  }, [activeCell]);

  const onFocus = useCallback(() => {
    dispatch({
      type: "BATCH",
      payload: { isCellEditing: true, editCellValue: initValue },
    });
  }, [initValue, dispatch]);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget;
      dispatch({ type: "CHANGE_Edit_CELL_VALUE", payload: value });
    },
    [dispatch]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;
      if (key === "Enter") {
        inputRef.current?.blur();
        controller.setActiveCell(activeCell.row + 1, activeCell.col);
      }
    },
    [activeCell, controller]
  );

  const onBlur = useCallback(() => {
    containersLog("FormulaEditor onBlur");
    controller.setCellValue(editCellValue);
    dispatch({
      type: "BATCH",
      payload: { isCellEditing: false, editCellValue: "" },
    });
  }, [controller, editCellValue, dispatch]);

  return (
    <BaseEditor
      value={isCellEditing ? editCellValue : initValue}
      ref={inputRef}
      onFocus={onFocus}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
    />
  );
});

FormulaEditor.displayName = "FormulaEditor";
