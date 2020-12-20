import React, { memo } from "react";
import styled from "styled-components";
import { TextEditor, CommonProps } from "@/components";
import { useSelector } from "@/store";
import { CELL_HEIGHT, CELL_WIDTH } from "@/util";
export const EditorWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: ${CELL_WIDTH}px;
  height: ${CELL_HEIGHT}px;
  border: 2px solid #0089ff;
  border-radius: 2px;
  background-color: #fff;
  box-sizing: border-box;
`;

export const EditorContainer = memo((props: CommonProps) => {
  const { activeCell, isCellEditing } = useSelector([
    "activeCell",
    "isCellEditing",
  ]);
  const { value, row, col, ...rest } = activeCell;
  console.log("EditorContainer", activeCell);
  return (
    <EditorWrapper style={rest}>
      <TextEditor {...props} value={value} isCellEditing={isCellEditing} />
    </EditorWrapper>
  );
});

EditorContainer.displayName = "EditorContainer";
