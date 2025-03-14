import { getRandomColor } from './util';

type NameSpaceType =
  | 'react'
  | 'model'
  | 'test'
  | 'collaboration'
  | 'controller';

export class Debug {
  namespace: NameSpaceType;

  static readonly colorMap: Map<NameSpaceType, string> = new Map<
    NameSpaceType,
    string
  >();
  constructor(namespace: NameSpaceType) {
    this.namespace = namespace;
  }
  init = () => {
    this.setColor();
    return this.log;
  };
  log = (...rest: unknown[]): void => {
    if (!this.enable()) {
      return;
    }
    const { namespace } = this;
    const color = Debug.colorMap.get(namespace);
    const result = [`%c ${namespace}:`, `color:${color};`, ...rest];
    console.log(...result);
  };
  enable() {
    return window.localStorage.getItem('debug');
  }
  setColor() {
    if (!Debug.colorMap.has(this.namespace)) {
      Debug.colorMap.set(this.namespace, getRandomColor());
    }
  }
}

export const modelLog = new Debug('model').init();
export const controllerLog = new Debug('controller').init();
export const reactLog = new Debug('react').init();
export const collaborationLog = new Debug('collaboration').init();
