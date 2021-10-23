import ReactDom from "react-dom";
import React from "react";

import { App } from "./entry/App";
import { ErrorBoundary } from "@/components";

import { StoreProvider } from "@/store";
import { readXLSXfile } from "@/xlsx";

import "./global.css";
import "./containers/index.css";
import "./components/index.css";

ReactDom.render(
  <React.StrictMode>
    <ErrorBoundary>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("root") as HTMLDivElement
);

(async () => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }
  const result = await fetch("../test.xlsx");
  if (result.status === 404) {
    console.error("not found xlsx");
    return;
  }
  const blob = await result.blob();
  readXLSXfile(blob);
})();
