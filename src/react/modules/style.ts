import { VNode, VNodeData } from '../vNode';
import { Module } from './module';
import { CAPS_REGEX } from './dataset';

export type CSSProperties = {
  [K in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[K] | number;
} & {
  [event: string]: string | number;
};

const convertKey = (key: string) =>
  key.replace(CAPS_REGEX, '-$&').toLowerCase();

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
      if (name.slice(0, 2) === '--') {
        elm.style.removeProperty(name);
      } else {
        elm.style[convertKey(name)] = '';
      }
    }
  }
  for (name in style) {
    if (style[name] !== oldStyle[name]) {
      if (name.slice(0, 2) === '--') {
        elm.style.setProperty(name, style[name]);
      } else {
        const key = convertKey(name);
        const t = style[name];
        if (typeof t === 'number') {
          elm.style[key] = t + 'px';
        } else {
          elm.style[key] = t;
        }
      }
    }
  }
}

export const styleModule: Module = {
  create: updateStyle,
  update: updateStyle,
};
