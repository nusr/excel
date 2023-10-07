import { App } from './containers';
import './global.css';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { initController } from '@/controller';
import { theme } from './util';

function initTheme(dom: HTMLElement) {
  const keyList = Object.keys(theme) as Array<keyof typeof theme>;
  for (const key of keyList) {
    dom.style.setProperty(`--${key}`, String(theme[key] || ''));
  }
}

const domNode = document.getElementById('root')!;
initTheme(document.documentElement);
const controller = initController();
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <App controller={controller} />
  </React.StrictMode>,
);
