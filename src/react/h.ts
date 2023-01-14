import { VNode, VNodeData, Key, Listener } from './vNode';
import { CSSProperties } from './modules/style';
import { Hooks } from './hooks';

const SVG_NS = 'http://www.w3.org/2000/svg';

type EventListener = {
  [N in keyof HTMLElementEventMap as N extends string
    ? `on${N}`
    : never]?: Listener<HTMLElementEventMap[N]>;
};

interface VNodePropsData extends EventListener {
  className?: string;
  style?: CSSProperties;
  key?: Key;
  id?: string;
  value?: string | number;
  href?: string;
  fill?: string;
  ns?: string; // for SVGs
  viewBox?: string;
  name?: string;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  target?: string;
  rel?: string;
  d?: string;
  'fill-opacity'?: string;
  hook?: Hooks;
  'data-testId'?: string;
  disabled?: boolean;
  title?: string;
}

function addNs(node: VNode) {
  node.data!.ns = SVG_NS;
  if (node.data?.props) {
    node.data!.attrs = Object.assign(
      node.data!.props || {},
      node.data?.attrs || {},
    );
    node.data!.props = undefined;
  } else {
    node.data!.attrs = {};
  }
  node.data!.attrs.class = node.data!.className || '';
  node.data!.className = undefined;
  if (node.children) {
    for (const item of node.children) {
      if (item) {
        addNs(item);
      }
    }
  }
}

export function h(
  sel: string,
  data: VNodePropsData,
  ...children: Array<VNode | string | null | undefined | number>
): VNode {
  const key = data.key === undefined ? undefined : data.key;
  const nodeData: VNodeData = {
    hook: data.hook,
    style: data.style,
    key: data.key,
    className: data.className,
  };

  const nodeList: VNode[] = [];
  const textList: string[] = [];
  const list = children || [];
  for (const item of list) {
    if (typeof item === 'string' || typeof item === 'number') {
      const t = String(item);
      if (t) {
        textList.push(t);
      }
    } else if (item && typeof item === 'object') {
      nodeList.push(item);
    }
  }
  const keyList = Object.keys(data) as Array<keyof VNodePropsData>;
  for (const key of keyList) {
    if (['className', 'style', 'key', 'ns', 'is'].includes(key)) {
      continue;
    }
    const item: any = data[key];
    if (key === 'data-testId') {
      if (!nodeData.dataset) {
        nodeData.dataset = {};
      }
      nodeData.dataset[key.slice(5)] = item;
    } else if (key.startsWith('on')) {
      if (!nodeData.on) {
        nodeData.on = {};
      }

      nodeData.on[key.slice(2)] = item;
    } else {
      if (!nodeData.props) {
        nodeData.props = {};
      }
      nodeData.props[key] = item;
    }
  }
  const result: VNode = {
    sel: sel,
    data: nodeData,
    key,
    elm: undefined,
    children: [],
    text: undefined,
  };

  if (textList.length > 0 && nodeList.length > 0) {
    throw new Error('error node');
  }
  if (textList.length > 0) {
    result.text = textList.join(' ');
  }
  if (nodeList.length > 0) {
    result.children = nodeList;
  }
  if (result.sel === 'svg') {
    addNs(result);
  }

  return result;
}
