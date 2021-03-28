import { randomInt } from "@/lodash";
import { assert } from "./assert";
import { DEBUG_COLOR_LIST } from "./constant";
type NameSpaceType =
  | "store"
  | "controller"
  | "canvas"
  | "model"
  | "util"
  | "interaction"
  | "containers"
  | "history";

class Debug {
  namespace: NameSpaceType;

  static readonly colorMap: Map<NameSpaceType, string> = new Map<
    NameSpaceType,
    string
  >();
  static readonly enableMap: Map<NameSpaceType, boolean> = new Map<
    NameSpaceType,
    boolean
  >([
    ["model", false],
    ["store", false],
    ["interaction", false],
    ["history", false],
    ["canvas", false],
    ["controller", false],
  ]);
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
    const index = randomInt(0, DEBUG_COLOR_LIST.length - 1);
    assert(index >= 0 && index < DEBUG_COLOR_LIST.length, String(index));
    return DEBUG_COLOR_LIST[index];
  };
  enable() {
    return this.checkEnable() && Debug.enableMap.get(this.namespace) !== false;
  }
  checkEnable(storage = window.localStorage) {
    return storage.getItem("debug") === "*";
  }
  setColor() {
    if (!Debug.colorMap.has(this.namespace)) {
      Debug.colorMap.set(this.namespace, this.getRandomColor());
    }
  }
}

export const storeLog = new Debug("store").init();
export const controllerLog = new Debug("controller").init();
export const canvasLog = new Debug("canvas").init();
export const modelLog = new Debug("model").init();
export const utilLog = new Debug("util").init();
export const interactionLog = new Debug("interaction").init();
export const containersLog = new Debug("containers").init();
export const historyLog = new Debug("history").init();
