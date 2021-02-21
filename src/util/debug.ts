import random from "lodash/random";
import noop from "lodash/noop";
import { assert } from "./assert";
export const DEBUG_COLOR_LIST = [
  "#0000CC",
  "#0000FF",
  "#0033CC",
  "#0033FF",
  "#0066CC",
  "#0066FF",
  "#0099CC",
  "#0099FF",
  "#00CC00",
  "#00CC33",
  "#00CC66",
  "#00CC99",
  "#00CCCC",
  "#00CCFF",
  "#3300CC",
  "#3300FF",
  "#3333CC",
  "#3333FF",
  "#3366CC",
  "#3366FF",
  "#3399CC",
  "#3399FF",
  "#33CC00",
  "#33CC33",
  "#33CC66",
  "#33CC99",
  "#33CCCC",
  "#33CCFF",
  "#6600CC",
  "#6600FF",
  "#6633CC",
  "#6633FF",
  "#66CC00",
  "#66CC33",
  "#9900CC",
  "#9900FF",
  "#9933CC",
  "#9933FF",
  "#99CC00",
  "#99CC33",
  "#CC0000",
  "#CC0033",
  "#CC0066",
  "#CC0099",
  "#CC00CC",
  "#CC00FF",
  "#CC3300",
  "#CC3333",
  "#CC3366",
  "#CC3399",
  "#CC33CC",
  "#CC33FF",
  "#CC6600",
  "#CC6633",
  "#CC9900",
  "#CC9933",
  "#CCCC00",
  "#CCCC33",
  "#FF0000",
  "#FF0033",
  "#FF0066",
  "#FF0099",
  "#FF00CC",
  "#FF00FF",
  "#FF3300",
  "#FF3333",
  "#FF3366",
  "#FF3399",
  "#FF33CC",
  "#FF33FF",
  "#FF6600",
  "#FF6633",
  "#FF9900",
  "#FF9933",
  "#FFCC00",
  "#FFCC33",
];

const getRandomColor = (): string => {
  const index = random(0, DEBUG_COLOR_LIST.length - 1);
  assert(index >= 0 && index < DEBUG_COLOR_LIST.length, String(index));
  return DEBUG_COLOR_LIST[index];
};

function checkEnable(storage = window.localStorage) {
  return storage.getItem("debug") === "*";
}

function debug(namespace: string) {
  const check = !checkEnable() || debug.enableMap.get(namespace) === false;
  if (check) {
    return noop;
  }
  if (!debug.colorMap.has(namespace)) {
    debug.colorMap.set(namespace, getRandomColor());
  }

  function log(...rest: Array<unknown>): void {
    const result = [
      `%c ${namespace}:`,
      `color:${debug.colorMap.get(namespace)};`,
      ...rest,
    ];
    console.log(...result);
  }
  return log;
}
debug.colorMap = new Map<string, string>();
debug.enableMap = new Map<string, boolean>([
  ["model", false],
  ["store", false],
]);

export const storeLog = debug("store");
export const controllerLog = debug("controller");
export const canvasLog = debug("canvas");
export const modelLog = debug("model");
export const utilLog = debug("util");
export const interactionLog = debug("interaction");
export const containersLog = debug("containers");
