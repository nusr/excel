import React, { memo, useMemo } from "react";
import styled, { withTheme } from "styled-components";
import { pick } from "@/lodash";
import { useSelector } from "@/store";
import { CELL_HEIGHT, CELL_WIDTH } from "@/util";
import { TextEditorContainer } from "../TextEditor";

const EditorWrapper = withTheme(styled.div`
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

export const CellEditorContainer = memo(() => {
  const { activeCell, isCellEditing } = useSelector([
    "activeCell",
    "isCellEditing",
  ]);
  const style = useMemo(() => {
    const temp = pick(activeCell, ["top", "left", "width", "height"]);
    return {
      ...temp,
      display: isCellEditing ? "inline-block" : "none",
    };
  }, [activeCell, isCellEditing]);
  return (
    <EditorWrapper style={style}>
      <TextEditorContainer />
    </EditorWrapper>
  );
});

CellEditorContainer.displayName = "CellEditorContainer";
