import React, { useEffect } from "react";
import { Lazy } from "@/components";
import styled, { ThemeProvider } from "styled-components";
import theme from "@/theme";
import { useDispatch, useController } from "@/store";
import { MOCK_MODEL } from "@/model";
import { handleBuildError } from "@/util";
import { State } from "@/types";

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
const AsyncGlobalStyle = React.lazy(() => import("./GlobalStyle"));

const AppContainer = styled.div`
  overflow: hidden;
  height: 100%;
`;

export const App = React.memo(() => {
  const controller = useController();
  const dispatch = useDispatch();
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
    <ThemeProvider theme={theme}>
      <Lazy>
        <AsyncGlobalStyle />
      </Lazy>
      <AppContainer id="AppContainer">
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
      </AppContainer>
    </ThemeProvider>
  );
});

App.displayName = "APP";
