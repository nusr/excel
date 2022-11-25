import { VNode, VNodeData } from '../vNode';
import { Module } from './module';

export type Dataset = Record<string, string>;

export const CAPS_REGEX = /[A-Z]/g;

function updateDataset(oldVNode: VNode, vNode: VNode): void {
  const elm: HTMLElement = vNode.elm as HTMLElement;
  let oldDataset = (oldVNode.data as VNodeData).dataset;
  let dataset = (vNode.data as VNodeData).dataset;
  let key: string;

  if (!oldDataset && !dataset) return;
  if (oldDataset === dataset) return;
  oldDataset = oldDataset || {};
  dataset = dataset || {};
  const d = elm.dataset;

  for (key in oldDataset) {
    if (!dataset[key]) {
      if (d) {
        if (key in d) {
          delete d[key];
        }
      } else {
        elm.removeAttribute(
          'data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(),
        );
      }
    }
  }
  for (key in dataset) {
    if (oldDataset[key] !== dataset[key]) {
      if (d) {
        d[key] = dataset[key];
      } else {
        elm.setAttribute(
          'data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(),
          dataset[key],
        );
      }
    }
  }
}

export const datasetModule: Module = {
  create: updateDataset,
  update: updateDataset,
};
