import { render } from './react';
import { App } from './containers';
import { DEFAULT_STORE_VALUE } from './util';
import {
  initCanvas,
  initController,
  initTheme,
  initFontFamilyList,
} from './init';
import './global.css';

export const initExcel = (containerDom: HTMLDivElement) => {
  const fontFamilyList = initFontFamilyList();

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
  stateValue.fontFamilyList = fontFamilyList;
  setState();
  return initCanvas(stateValue, controller);
};
