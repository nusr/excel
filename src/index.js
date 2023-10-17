import { App } from './containers';
import './global.css';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { initController } from '@/controller';
import { theme } from './util';
import { MOCK_MODEL } from '@/model';
function initTheme(dom) {
    const keyList = Object.keys(theme);
    for (const key of keyList) {
        dom.style.setProperty(`--${key}`, String(theme[key] || ''));
    }
}
const domNode = document.getElementById('root');
initTheme(document.documentElement);
const controller = initController();
controller.fromJSON(MOCK_MODEL);
const root = ReactDOM.createRoot(domNode);
root.render(React.createElement(React.StrictMode, null,
    React.createElement(App, { controller: controller })));
//# sourceMappingURL=index.js.map