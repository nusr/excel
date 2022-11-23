import { VNode, VNodeData } from '../vNode';
import { Module } from './module';

export type Props = Record<string, any>;

function updateProps(oldVNode: VNode, vNode: VNode): void {
  let key: string;
  let cur: any;
  let old: any;
  const elm: any = vNode.elm;
  let oldProps = (oldVNode.data as VNodeData).props;
  let props = (vNode.data as VNodeData).props;

  if (!oldProps && !props) return;
  if (oldProps === props) return;
  oldProps = oldProps || {};
  props = props || {};

  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}

export const propsModule: Module = { create: updateProps, update: updateProps };
