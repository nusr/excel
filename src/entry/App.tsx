import React, { useEffect } from "react";
import { CanvasContainer, Toolbar, SheetBar, FormulaBar } from "@/containers";
import styled, { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./GlobalStyle";
import theme from "@/theme";
import { useDispatch } from "@/store";
import { getSingletonController } from "@/controller";
import { MOCK_MODEL } from "@/model";
import { handleBuildError } from "@/util";

const AppContainer = styled.div`
  overflow: hidden;
  height: 100%;
`;
export const App = React.memo(() => {
  const dispatch = useDispatch();
  useEffect(() => {
    const controller = getSingletonController();
    const off = controller.on("dispatch", (data) => {
      console.log("on dispatch", data);
      dispatch(data);
    });
    controller.on("change", (data) => {
      const { changeSet } = data;
      if (changeSet.includes("contentChange")) {
        const { sheetList, currentSheetId } = controller.model;
        dispatch({ type: "SET_SHEET_LIST", payload: sheetList });
        dispatch({ type: "SET_CURRENT_SHEET_ID", payload: currentSheetId });
      }
      const { isCellEditing } = controller;
      const cell = controller.queryActiveCell();
      const payload = isCellEditing ? String(cell?.value || "") : "";
      dispatch({ type: isCellEditing ? "ENTER_EDITING" : "QUIT_EDITING" });
      dispatch({
        type: "CHANGE_Edit_CELL_VALUE",
        payload,
      });
      if (cell) {
        dispatch({
          type: "CHANGE_ACTIVE_CELL",
          payload: cell,
        });
      }
    });
    controller.loadJSON(MOCK_MODEL);
    const offError = handleBuildError();
    (window as any).controller = controller;
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
