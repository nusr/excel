import React, { memo, useCallback } from "react";
import { TextEditor } from "@/components";
import { useSelector, useDispatch } from "@/store";
import { getSingletonController } from "@/controller";

type Props = {
  isFormulaBar?: boolean;
};

export const TextEditorContainer = memo<Props>(({ isFormulaBar = false }) => {
  const { activeCell, isCellEditing, editCellValue } = useSelector([
    "activeCell",
    "isCellEditing",
    "editCellValue",
  ]);
  let value = "";
  if (isCellEditing) {
    value = editCellValue;
  } else {
    const temp = String(activeCell.value || "");
    if (isFormulaBar) {
      value = (activeCell.formula ? `=${activeCell.formula}` : "") || temp;
    } else {
      value = temp;
    }
  }
  const dispatch = useDispatch();

  const onInputEnter = useCallback(() => {
    const controller = getSingletonController();
    controller.setCellValue(editCellValue);
    controller.quitEditing();
    controller.setActiveCell(activeCell.row + 1, activeCell.col);
  }, [activeCell, editCellValue]);
  const onInputTab = useCallback(() => {
    const controller = getSingletonController();
    controller.setCellValue(editCellValue);
    controller.quitEditing();
    controller.setActiveCell(activeCell.row, activeCell.col + 1);
  }, [activeCell, editCellValue]);
  const onBlur = useCallback(() => {
    // const controller = getSingletonController();
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
      value={value}
      isCellEditing={isCellEditing}
      onBlur={onBlur}
      onInputEnter={onInputEnter}
      onInputTab={onInputTab}
      onChange={onChange}
    />
  );
});

TextEditorContainer.displayName = "TextEditorContainer";
