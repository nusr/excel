import React, { useEffect } from "react";
import {
  CanvasContainer,
  ToolbarContainer,
  SheetBarContainer,
  FormulaBar,
} from "@/containers";
import styled, { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./GlobalStyle";
import theme from "@/theme";
import { useDispatch, useController } from "@/store";
import { MOCK_MODEL } from "@/model";
import { handleBuildError } from "@/util";
import { State } from "@/types";

const AppContainer = styled.div`
  overflow: hidden;
  height: 100%;
`;

export const App = React.memo(() => {
  const controller = useController();
  const dispatch = useDispatch();
  useEffect(() => {
    const off = controller.on("dispatch", (data) => {
      dispatch(data);
    });
    controller.on("change", (data) => {
      const { changeSet } = data;
      const state: Partial<State> = {
        canRedo: controller.canRedo(),
        canUndo: controller.canUndo(),
      };
      if (changeSet.includes("contentChange")) {
        const { workbook, currentSheetId } = controller.model;
        state.sheetList = workbook;
        state.currentSheetId = currentSheetId;
      }
      const { isCellEditing } = controller;
      const cell = controller.queryActiveCellInfo();
      const payload = isCellEditing ? String(cell?.value || "") : "";
      state.isCellEditing = isCellEditing;
      state.editCellValue = payload;
      if (cell) {
        const temp = controller.getRenderController();
        const config = temp
          ? temp.queryCell(cell.row, cell.col)
          : { top: 0, left: 0, width: 0, height: 0 };
        state.activeCell = { ...cell, ...config };
      }
      dispatch({ type: "BATCH", payload: state });
    });
    controller.loadJSON(MOCK_MODEL);
    const offError = handleBuildError(controller);
    return () => {
      off();
      offError();
    };
  }, [dispatch, controller]);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer id="AppContainer">
        <ToolbarContainer />
        <FormulaBar />
        <CanvasContainer />
        <SheetBarContainer />
      </AppContainer>
    </ThemeProvider>
  );
});

App.displayName = "APP";
