import { render } from "./react";
import { App } from "./App";
import { DEFAULT_STORE_VALUE } from "./util";
import {
  initCanvas,
  initController,
  initTheme,
  initFontFamilyList,
} from "./init";
import "./global.css";
import "./components/index.css";
import "./containers/index.css";

function init(containerDom: HTMLDivElement) {
  initTheme(document.documentElement);
  const controller = initController();
  const stateValue = new Proxy(DEFAULT_STORE_VALUE, {
    set(obj, prop, value) {
      const res = Reflect.set(obj, prop, value);
      setState();
      return res;
    },
  });

  const setState = () => {
    render(containerDom, App(stateValue, controller));
  };
  setState();
  stateValue.fontFamilyList = initFontFamilyList();
  initCanvas(stateValue, controller);
}

init(document.querySelector<HTMLDivElement>("#root")!);
