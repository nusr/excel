import ReactDom from "react-dom";
import React from "react";
import { App } from "./entry/App";
import { StoreProvider } from "@/store";
import { MOCK_MODEL } from "@/model";
import { getSingletonController } from "@/controller";

ReactDom.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root") as HTMLDivElement
);

function init() {
  const controller = getSingletonController();
  controller.loadJSON(MOCK_MODEL);
}

init();
