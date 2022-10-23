import React, { memo, useCallback } from "react";
import { classnames } from "@/util";
import { Button, BaseIcon } from "@/components";
import { useSelector, useController } from "@/store";
import theme from "@/theme";
import { WorksheetType } from "@/types";
const addButtonStyle = {
  backgroundColor: theme.buttonActiveColor,
};

export const SheetBarContainer = memo(() => {
  const controller = useController();
  const { currentSheetId, sheetList = [] } = useSelector([
    "currentSheetId",
    "sheetList",
  ]);
  const handleClickSheet = useCallback(
    (item: WorksheetType) => {
      controller.setCurrentSheetId(item.sheetId);
    },
    [controller]
  );
  const handleAddSheet = useCallback(() => {
    controller.addSheet();
  }, [controller]);
  return (
    <div className="sheet-bar-wrapper" id="sheet-bar-container">
      <div className="sheet-bar-list ">
        {sheetList.map((item) => (
          <div
            key={item.sheetId}
            onMouseDown={() => handleClickSheet(item)}
            className={classnames("sheet-bar-item", {
              active: currentSheetId === item.sheetId,
            })}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div style={{ marginLeft: 20 }}>
        <Button style={addButtonStyle} type="circle" onClick={handleAddSheet}>
          <BaseIcon name="plus" />
        </Button>
      </div>
    </div>
  );
});

SheetBarContainer.displayName = "SheetBarContainer";
