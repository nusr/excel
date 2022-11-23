import { VNode, VNodeData } from '../vNode';
import { Module } from './module';

export type VNodeStyle = Record<string, string>;

function updateStyle(oldVNode: VNode, vNode: VNode): void {
  let name: string;
  const elm = vNode.elm;
  let oldStyle = (oldVNode.data as VNodeData).style;
  let style = (vNode.data as VNodeData).style;

  if (!oldStyle && !style) return;
  if (oldStyle === style) return;
  oldStyle = oldStyle || {};
  style = style || {};

  for (name in oldStyle) {
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') {
        (elm as any).style.removeProperty(name);
      } else {
        (elm as any).style[name] = '';
      }
    }
  }
}

export const styleModule: Module = {
  create: updateStyle,
  update: updateStyle,
};
