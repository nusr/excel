import React, { memo, useCallback } from "react";
import { TextEditor } from "@/components";
import { useSelector, useDispatch } from "@/store";
import { getSingletonController } from "@/controller";

export const TextEditorContainer = memo(() => {
  const { activeCell, isCellEditing, editCellValue } = useSelector([
    "activeCell",
    "isCellEditing",
    "editCellValue",
  ]);
  const dispatch = useDispatch();
  const onInputEnter = useCallback(() => {
    const controller = getSingletonController();
    controller.setCellValue(activeCell.row, activeCell.col, editCellValue);
    controller.updateSelection(activeCell.row + 1, activeCell.col);
  }, [activeCell, editCellValue]);
  const onInputTab = useCallback(() => {
    const controller = getSingletonController();
    controller.setCellValue(activeCell.row, activeCell.col, editCellValue);
    controller.updateSelection(activeCell.row, activeCell.col + 1);
  }, [activeCell, editCellValue]);
  const onBlur = useCallback(() => {
    getSingletonController().quitEditing();
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
      value={editCellValue}
      isCellEditing={isCellEditing}
      onBlur={onBlur}
      onInputEnter={onInputEnter}
      onInputTab={onInputTab}
      onChange={onChange}
    />
  );
});

TextEditorContainer.displayName = "TextEditorContainer";
