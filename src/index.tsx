import { render, h } from '@/react';
import { App } from '@/entry/App';
import './global.css';
import './components/index.css';
import './containers/index.css';

render(h(App, {}), document.querySelector('#root')!);
