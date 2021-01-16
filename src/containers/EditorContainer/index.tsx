import React, { memo, useMemo, useCallback } from "react";
import styled, { withTheme } from "styled-components";
import { TextEditor } from "@/components";
import { useSelector } from "@/store";
import { CELL_HEIGHT, CELL_WIDTH } from "@/util";
import { getSingletonController } from "@/controller";
export const EditorWrapper = withTheme(styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;
  border: 1px solid ${({ theme }) => theme.primaryColor};
  border-radius: 2px;
  background-color: #fff;
  box-sizing: border-box;
`);
export const EditorContainer = memo(() => {
  const { activeCell, isCellEditing } = useSelector([
    "activeCell",
    "isCellEditing",
  ]);
  const { value, row, col, ...rest } = activeCell;
  const style = useMemo(() => {
    return {
      ...rest,
      display: isCellEditing ? "inline-block" : "none",
    };
  }, [rest, isCellEditing]);
  const onInputEnter = useCallback(
    (textValue: string) => {
      const controller = getSingletonController();
      controller.setCellValue(activeCell.row, activeCell.col, textValue);
      controller.updateSelection(activeCell.row + 1, activeCell.col);
    },
    [activeCell]
  );
  const onInputTab = useCallback(
    (textValue: string) => {
      const controller = getSingletonController();
      controller.setCellValue(activeCell.row, activeCell.col, textValue);
      controller.updateSelection(activeCell.row, activeCell.col + 1);
    },
    [activeCell]
  );
  const onBlur = useCallback(() => {
    getSingletonController().quitEditing();
  }, []);
  return (
    <EditorWrapper style={style}>
      <TextEditor
        value={value}
        isCellEditing={isCellEditing}
        onBlur={onBlur}
        onInputEnter={onInputEnter}
        onInputTab={onInputTab}
      />
    </EditorWrapper>
  );
});

EditorContainer.displayName = "EditorContainer";
