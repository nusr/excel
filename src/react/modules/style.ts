import { VNode, VNodeData } from '../vNode';
import { Module } from './module';

export type VNodeStyle = Record<string, string>;

function updateStyle(oldVNode: VNode, vNode: VNode): void {
  let name: string;
  const elm: any = vNode.elm;
  let oldStyle = (oldVNode.data as VNodeData).style;
  let style = (vNode.data as VNodeData).style;

  if (!oldStyle && !style) return;
  if (oldStyle === style) return;
  oldStyle = oldStyle || {};
  style = style || {};

  for (name in oldStyle) {
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') {
        elm.style.removeProperty(name);
      } else {
        elm.style[name] = '';
      }
    }
  }
  for (name in style) {
    if (style[name] !== oldStyle[name]) {
      elm.style[name] = style[name];
    }
  }
}

export const styleModule: Module = {
  create: updateStyle,
  update: updateStyle,
};
