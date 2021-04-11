import React, { memo, useMemo } from "react";
import { useSelector } from "@/store";
import { FormulaEditor } from "./FormulaEditor";
import { intToColumnName } from "@/util";

export const FormulaBar = memo(() => {
  const { activeCell } = useSelector(["activeCell"]);
  const { row, col } = activeCell;
  const text = useMemo(() => {
    return `${intToColumnName(col)}${row + 1}`;
  }, [row, col]);
  return (
    <div className="formula-bar-wrapper" id="formula-bar-container">
      <div className="formula-bar-name">{text}</div>
      <div className="formula-bar-editor-wrapper">
        <FormulaEditor />
      </div>
    </div>
  );
});

FormulaBar.displayName = "FormulaBar";
