import React, { memo, useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "@/store";
import { TextEditorContainer } from "../TextEditor";
import { intToColumnName } from "@/util";
const FormulaBarContainer = styled.div`
  width: 100%;
  padding: 0 5px;
  box-sizing: border-box;
  height: 20px;
  line-height: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActiveCellName = styled.div`
  border: 1px solid #ccc;
  width: 100px;
  margin-right: 10px;
  border-radius: 4px;
  text-align: center;
`;

const TextEditorWrapper = styled.div`
  border: 1px solid #ccc;
  flex: 1;
  border-radius: 4px;
`;

export const FormulaBar = memo(() => {
  const { activeCell } = useSelector(["activeCell"]);
  const { row, col } = activeCell;
  const text = useMemo(() => {
    return `${intToColumnName(col + 1)}${row + 1}`;
  }, [row, col]);
  return (
    <FormulaBarContainer id="formula-bar-container">
      <ActiveCellName>{text}</ActiveCellName>
      <TextEditorWrapper>
        <TextEditorContainer />
      </TextEditorWrapper>
    </FormulaBarContainer>
  );
});

FormulaBar.displayName = "FormulaBar";
