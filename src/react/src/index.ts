import type { StoreValue, IController } from '@/types';
import { VNode } from './vNode';
import { init } from './init';
import { attributesModule } from './modules/attributes';
import { classModule } from './modules/class';
import { datasetModule } from './modules/dataset';
import { eventListenersModule } from './modules/event';
import { propsModule } from './modules/props';
import { styleModule } from './modules/style';
import { htmlDomApi } from './dom';

interface DomType extends Element {
  vDom?: VNode;
}
const patch = init(
  [
    attributesModule,
    classModule,
    datasetModule,
    eventListenersModule,
    propsModule,
    styleModule,
  ],
  htmlDomApi,
);
export function render(container: Element, vNode: VNode): VNode {
  const dom = container as DomType;
  let temp: VNode;
  if (dom.vDom) {
    temp = patch(dom.vDom as VNode, vNode);
  } else {
    temp = patch(dom, vNode);
  }
  dom.vDom = temp;
  return temp;
}

export type { VNode, Component } from './vNode';
export { h } from './h';
export type { VNodeStyle } from './modules/style';

export interface SmartComponent {
  (props: StoreValue, controller: IController): VNode;
  displayName: string;
}
