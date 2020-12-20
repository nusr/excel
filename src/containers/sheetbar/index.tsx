import React, { memo, useCallback } from "react";
import styled from "styled-components";
import classnames from "classnames";
import { useSelector } from "@/store";
import { getController } from "@/util";
export const SheetBarContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: #c6c6c6;
`;
const SheetList = styled.div`
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
`;
const SheetItem = styled.div`
  padding: 0 10px;
  border-left: 1px solid #808080;
  &.active {
    background-color: #fff;
    color: green;
  }
`;

export const SheetBar = memo(() => {
  const { currentSheetId, sheetList = [] } = useSelector([
    "currentSheetId",
    "sheetList",
  ]);
  console.log(currentSheetId, sheetList);
  const handleClickSheet = useCallback((item) => {
    console.log(item);
    getController().setCurrentSheetId(item.sheetId);
  }, []);
  return (
    <SheetBarContainer id="sheet-bar-container">
      <SheetList>
        {sheetList.map((item) => (
          <SheetItem
            key={item.sheetId}
            onClick={() => handleClickSheet(item)}
            className={classnames({ active: currentSheetId === item.sheetId })}
          >
            {item.name}
          </SheetItem>
        ))}
      </SheetList>
    </SheetBarContainer>
  );
});

SheetBar.displayName = "SheetBar";
