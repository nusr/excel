import { VNode, VNodeData } from '../vNode';
import { Module } from './module';
import { CAPS_REGEX } from './dataset'

export type CSSProperties = Partial<CSSStyleDeclaration>;


const convertKey = (key: string) => key.replace(CAPS_REGEX, '-$&').toLowerCase()

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
      elm.style[convertKey(name)] = '';
    }
  }
  for (name in style) {
    if (style[name] !== oldStyle[name]) {
      const key = convertKey(name);
      elm.style[key] = style[name];
    }
  }
}

export const styleModule: Module = {
  create: updateStyle,
  update: updateStyle,
};
