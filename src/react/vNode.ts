import { Hooks } from './hooks';
import { CSSProperties } from './modules/style';
import { On } from './modules/event';
import { Attrs } from './modules/attributes';
import { Props } from './modules/props';
import { Dataset } from './modules/dataset';

export type Key = string | number | symbol;
export type Listener<T> = (this: VNode, ev: T, vNode: VNode) => void;
export interface VNode {
  sel: string | undefined;
  data: VNodeData | undefined;
  children: Array<VNode> | undefined;
  elm: Node | undefined;
  text: string | undefined;
  key: Key | undefined;
}

export type Children = VNode | string | number;

export interface FunctionComponent<T = {}> {
  (props: T, ...children: Array<Children>): VNode;
  displayName: string;
}

export interface VNodeData {
  props?: Props;
  attrs?: Attrs;
  className?: string;
  style?: CSSProperties;
  dataset?: Dataset;
  on?: On;
  hook?: Hooks;
  key?: Key;
  ns?: string; // for SVGs
  is?: string; // for custom elements v1
}
