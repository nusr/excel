import { render } from '@/react';
import { App } from './App';
import globalStore from '@/store';
import './global.css';
import './components/index.css';
import './containers/index.css';

globalStore.value = new Proxy(globalStore.value, {
  set(obj, prop, value) {
    const res = Reflect.set(obj, prop, value);
    setState();

    return res;
  },
});

const setState = () => {
  render(document.getElementById('root')!, App({}));
};

setState();

globalStore.initCanvas();
