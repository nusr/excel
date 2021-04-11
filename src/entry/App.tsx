import React, { useEffect } from "react";
import { Lazy } from "@/components";
import { useDispatch, useController } from "@/store";
import { MOCK_MODEL } from "@/model";
import { handleBuildError } from "@/util";
import { State } from "@/types";
import { useTheme } from "@/hooks";

const AsyncCanvasContainer = React.lazy(
  () => import("./lazyLoad/CanvasContainer")
);

const AsyncToolbarContainer = React.lazy(
  () => import("./lazyLoad/ToolbarContainer")
);
const AsyncSheetBarContainer = React.lazy(
  () => import("./lazyLoad/SheetBarContainer")
);
const AsyncFormulaBar = React.lazy(() => import("./lazyLoad/FormulaBar"));

export const App = React.memo(() => {
  const controller = useController();
  const dispatch = useDispatch();
  useTheme();
  useEffect(() => {
    controller.on("change", (data) => {
      const { changeSet } = data;
      const state: Partial<State> = {
        canRedo: controller.canRedo(),
        canUndo: controller.canUndo(),
      };
      if (changeSet.has("contentChange")) {
        const { workbook, currentSheetId } = controller.model;
        state.sheetList = workbook;
        state.currentSheetId = currentSheetId;
      }
      const cell = controller.queryActiveCellInfo();
      const { isCellEditing, renderController } = controller;
      if (renderController) {
        const config = renderController.queryCell(cell.row, cell.col);
        state.activeCell = { ...cell, ...config };
      }
      state.isCellEditing = isCellEditing;
      if (isCellEditing) {
        const editCellValue =
          (cell.formula ? `=${cell.formula}` : "") || String(cell.value || "");
        state.editCellValue = editCellValue;
      } else {
        state.editCellValue = "";
      }
      dispatch({ type: "BATCH", payload: state });
    });
    controller.loadJSON(MOCK_MODEL);
    const offError = handleBuildError(controller);
    return () => {
      offError();
    };
  }, [dispatch, controller]);
  return (
    <div className="app-container" id="AppContainer">
      <Lazy>
        <AsyncToolbarContainer />
      </Lazy>
      <Lazy>
        <AsyncFormulaBar />
      </Lazy>
      <Lazy>
        <AsyncCanvasContainer />
      </Lazy>
      <Lazy>
        <AsyncSheetBarContainer />
      </Lazy>
    </div>
  );
});

App.displayName = "APP";
