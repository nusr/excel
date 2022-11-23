import { VNode, VNodeData } from '../vNode';
import { Module } from './module';

function updateClass(oldVNode: VNode, vNode: VNode): void {
  const elm: Element = vNode.elm as Element;
  const oldClass = (oldVNode.data as VNodeData).className;
  const newClass = (vNode.data as VNodeData).className;

  if (oldClass === newClass) return;
  elm.className = newClass || '';
}

export const classModule: Module = { create: updateClass, update: updateClass };
