import { assert } from './assert';
import { DEBUG_COLOR_LIST } from './constant';
type NameSpaceType = 'react' | 'controller' | 'canvas' | 'model';

class Debug {
  namespace: NameSpaceType;

  static readonly colorMap: Map<NameSpaceType, string> = new Map<
    NameSpaceType,
    string
  >();
  static readonly enableMap: Map<NameSpaceType, boolean> = new Map<
    NameSpaceType,
    boolean
  >([]);
  constructor(namespace: NameSpaceType) {
    this.namespace = namespace;
  }
  init = () => {
    this.setColor();
    return this.log;
  };
  log = (...rest: Array<unknown>): void => {
    if (!this.enable()) {
      return;
    }
    const { namespace } = this;
    const color = Debug.colorMap.get(namespace);
    const result = [`%c ${namespace}:`, `color:${color};`, ...rest];
    console.log(...result);
  };
  getRandomColor = (): string => {
    const index = Math.floor(Math.random() * DEBUG_COLOR_LIST.length);
    assert(index >= 0 && index < DEBUG_COLOR_LIST.length, String(index));
    return DEBUG_COLOR_LIST[index];
  };
  enable() {
    return this.checkEnable() && Debug.enableMap.get(this.namespace) !== false;
  }
  checkEnable(storage = window.localStorage) {
    return storage.getItem('debug') === '*';
  }
  setColor() {
    if (!Debug.colorMap.has(this.namespace)) {
      Debug.colorMap.set(this.namespace, this.getRandomColor());
    }
  }
}

export const reactLog = new Debug('react').init();
export const controllerLog = new Debug('controller').init();
export const canvasLog = new Debug('canvas').init();
export const modelLog = new Debug('model').init();
