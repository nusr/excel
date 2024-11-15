import { COLOR_PICKER_COLOR_LIST } from './constant';

type NameSpaceType = 'react' | 'model' | 'test' | 'collaboration' | string;

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
  getRandomColor = (): string => {
    const index = Math.floor(Math.random() * COLOR_PICKER_COLOR_LIST.length);
    return COLOR_PICKER_COLOR_LIST[index];
  };
  enable() {
    return window.localStorage.getItem('debug') === '*';
  }
  setColor() {
    if (!Debug.colorMap.has(this.namespace)) {
      Debug.colorMap.set(this.namespace, this.getRandomColor());
    }
  }
}

export const modelLog = new Debug('model').init();
export const reactLog = new Debug('react').init();
export const collaborationLog = new Debug('collaboration').init();
