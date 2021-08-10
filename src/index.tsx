import ReactDom from "react-dom";
import React from "react";

import { App } from "./entry/App";
import { ErrorBoundary } from "@/components";

import { StoreProvider } from "@/store";

import "./global.css";
import "./containers/index.css";
import "./components/index.css";
import "./parser";



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
