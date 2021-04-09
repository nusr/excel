import React, { memo, useMemo } from "react";
import styled, { withTheme } from "styled-components";
import { useSelector } from "@/store";
import { TextEditorContainer } from "../TextEditor";
import { intToColumnName } from "@/util";

const FormulaBarContainer = withTheme(styled.div`
  width: 100%;
  padding: 0 5px;
  box-sizing: border-box;
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.backgroundColor};
`);

const ActiveCellName = withTheme(styled.div`
  border: 1px solid ${(props) => props.theme.gridStrokeColor};
  width: 100px;
  height: 21px;
  line-height: 21px;
  margin-right: 10px;
  border-radius: 2px;
  text-align: center;
  background-color: ${(props) => props.theme.white};
  user-select: none;
`);

const TextEditorWrapper = withTheme(styled.div`
  border: 1px solid ${(props) => props.theme.gridStrokeColor};
  flex: 1;
  height: 21px;
  line-height: 21px;
  border-radius: 2px;
  background-color: ${(props) => props.theme.white};
`);

export const FormulaBar = memo(() => {
  const { activeCell } = useSelector(["activeCell"]);
  const { row, col } = activeCell;
  const text = useMemo(() => {
    return `${intToColumnName(col)}${row + 1}`;
  }, [row, col]);
  return (
    <FormulaBarContainer id="formula-bar-container">
      <ActiveCellName>{text}</ActiveCellName>
      <TextEditorWrapper>
        <TextEditorContainer isFormulaBar />
      </TextEditorWrapper>
    </FormulaBarContainer>
  );
});

FormulaBar.displayName = "FormulaBar";
