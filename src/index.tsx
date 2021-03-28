import ReactDom from "react-dom";
import React from "react";
import { App } from "./entry/App";
import { StoreProvider } from "@/store";
ReactDom.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root") as HTMLDivElement
);
