import React, { useEffect } from "react";
import { CanvasContainer, Toolbar, SheetBar, FormulaBar } from "@/containers";
import styled, { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./GlobalStyle";
import theme from "@/theme";
import { useDispatch } from "@/store";
import { controller, getSingletonController } from "@/controller";
import { MOCK_MODEL } from "@/model";
import { handleBuildError } from "@/util";
import { State } from "@/types";

const AppContainer = styled.div`
  overflow: hidden;
  height: 100%;
`;
export const App = React.memo(() => {
  const dispatch = useDispatch();
  useEffect(() => {
    const off = controller.on("dispatch", (data) => {
      dispatch(data);
    });
    controller.on("change", (data) => {
      const { changeSet } = data;
      const state: Partial<State> = {};
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
        state.activeCell = cell;
      }
      dispatch({ type: "BATCH", payload: state });
    });
    controller.loadJSON(MOCK_MODEL);
    const offError = handleBuildError(controller);
    return () => {
      getSingletonController.destroy();
      off();
      offError();
    };
  }, [dispatch]);
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer id="AppContainer">
        <Toolbar />
        <FormulaBar />
        <CanvasContainer />
        <SheetBar />
      </AppContainer>
    </ThemeProvider>
  );
});

App.displayName = "APP";
