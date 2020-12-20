import React from "react";
import { CanvasContainer, Toolbar, SheetBar } from "@/containers";
import styled, { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./GlobalStyle";
import theme from "@/theme";

const AppContainer = styled.div`
  overflow: hidden;
  height: 100%;
`;
export const App = React.memo(() => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer id="AppContainer">
        <Toolbar />
        <CanvasContainer />
        <SheetBar />
      </AppContainer>
    </ThemeProvider>
  );
});

App.displayName = "APP";
