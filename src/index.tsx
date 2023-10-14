import { App } from './containers';
import './global.css';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { initController } from '@/controller';
import { theme } from './util';
import { MOCK_MODEL } from '@/model';

function initTheme(dom: HTMLElement) {
  const keyList = Object.keys(theme) as Array<keyof typeof theme>;
  for (const key of keyList) {
    dom.style.setProperty(`--${key}`, String(theme[key] || ''));
  }
}

const domNode = document.getElementById('root')!;
initTheme(document.documentElement);
const controller = initController();
controller.fromJSON(MOCK_MODEL);
const root = ReactDOM.createRoot(domNode);

root.render(
  <React.StrictMode>
    <App controller={controller} />
  </React.StrictMode>,
);
