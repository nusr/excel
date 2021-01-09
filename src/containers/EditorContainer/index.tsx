import React, { memo, useMemo } from "react";
import styled, { withTheme } from "styled-components";
import { TextEditor, CommonProps } from "@/components";
import { useSelector } from "@/store";
import { CELL_HEIGHT, CELL_WIDTH } from "@/util";
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
export const EditorContainer = memo((props: CommonProps) => {
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
  console.log("EditorContainer", activeCell);
  return (
    <EditorWrapper style={style}>
      <TextEditor {...props} value={value} isCellEditing={isCellEditing} />
    </EditorWrapper>
  );
});

EditorContainer.displayName = "EditorContainer";
