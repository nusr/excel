import React, { memo, useCallback } from "react";
import styled, { withTheme } from "styled-components";
import { classnames } from "@/util";
import { Button, BaseIcon } from "@/components";
import { useSelector } from "@/store";
import { controller } from "@/controller";
import theme from "@/theme";
const addButtonStyle = {
  backgroundColor: theme.buttonActiveColor,
};

export const SheetBarContainer = withTheme(styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  background-color: ${({ theme }) => theme.backgroundColor};
  display: flex;
  align-items: center;
`);
const SheetList = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  line-height: 30px;
`;
const SheetItem = withTheme(styled.div`
  padding: 0 10px;
  border-left: 1px solid ${(props) => props.theme.gridStrokeColor};
  user-select: none;
  &.active {
    background-color: ${(props) => props.theme.white};
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
  const handleClickSheet = useCallback((item) => {
    controller.setCurrentSheetId(item.sheetId);
  }, []);
  const handleAddSheet = useCallback(() => {
    controller.addSheet();
  }, []);
  return (
    <SheetBarContainer id="sheet-bar-container">
      <SheetList>
        {sheetList.map((item) => (
          <SheetItem
            key={item.sheetId}
            onMouseDown={() => handleClickSheet(item)}
            className={classnames({ active: currentSheetId === item.sheetId })}
          >
            {item.name}
          </SheetItem>
        ))}
      </SheetList>
      <AddSheetWrapper>
        <Button style={addButtonStyle} type="circle" onClick={handleAddSheet}>
          <BaseIcon name="plus" />
        </Button>
      </AddSheetWrapper>
    </SheetBarContainer>
  );
});

SheetBar.displayName = "SheetBar";
