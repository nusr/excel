import React, { memo, useCallback } from "react";
import styled, { withTheme } from "styled-components";
import { classnames } from "@/util";
import { Button } from "@/components";
import { useSelector } from "@/store";
import { getSingletonController } from "@/controller";
import theme from "@/theme";
const addButtonStyle = {
  backgroundColor: theme.buttonActive,
};

export const SheetBarContainer = withTheme(styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: ${({ theme }) => theme.buttonActive};
  display: flex;
  align-items: center;
`);
const SheetList = styled.div`
  height: 30px;
  line-height: 30px;
  display: flex;
  align-items: center;
`;
const SheetItem = withTheme(styled.div`
  padding: 0 10px;
  border-left: 1px solid #808080;
  &.active {
    background-color: #fff;
    color: ${({ theme }) => theme.primaryColor};
  }
`);
const AddSheetWrapper = styled.div`
  margin-left: 20px;
`;

export const SheetBar = memo(() => {
  const { currentSheetId, sheetList = [] } = useSelector([
    "currentSheetId",
    "sheetList",
  ]);
  console.log(currentSheetId, sheetList);
  const handleClickSheet = useCallback((item) => {
    console.log(item);
    getSingletonController().setCurrentSheetId(item.sheetId);
  }, []);
  const handleAddSheet = useCallback(() => {
    console.log("handleAddSheet");
    getSingletonController().addSheet();
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
      <AddSheetWrapper>
        <Button style={addButtonStyle} type="circle" onClick={handleAddSheet}>
          +
        </Button>
      </AddSheetWrapper>
    </SheetBarContainer>
  );
});

SheetBar.displayName = "SheetBar";
