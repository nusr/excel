// @ts-nocheck
type ReactElement = VNode | string | null | undefined | number;
type ChildrenType = Array<ReactElement>;
export interface PropsType {
  className?: string;
  id?: string;
  children?: ChildrenType;
  dangerouslySetInnerHTML?: string;
  style?: string;
  key?: string | number;
  onclick?: (event: MouseEvent) => void;
  onblur?: (event: Event) => void;
  onfocus?: (event: FocusEvent) => void;
  onchange?: (event: Event) => void;
  onmouseout?: (event: MouseEvent) => void;
  onmouseleave?: (event: MouseEvent) => void;
  onkeydown?: (event: KeyboardEvent) => void;
  [key: string]: any;
}
interface VNode {
  tag: string;
  props: Record<string, any>;
  children: ChildrenType;
  key?: string;
  type?: number;
  node?: Element;
}

export interface Component<T = {}> {
  (props: T, ...children: VNode[]): VNode;
  displayName: string;
}

type DomType = Element;

const SSR_NODE = 1;
const TEXT_NODE = 3;
const EMPTY_OBJ = {};
const EMPTY_ARR: ChildrenType = [];
const SVG_NS = 'http://www.w3.org/2000/svg';

const listener = function (event) {
  this.events[event.type](event);
};

const getKey = (vdom: any) => (vdom == null ? vdom : vdom.key);

const patchProperty = (
  node: DomType,
  key: string,
  oldValue: VNode,
  newValue: VNode,
  isSvg?: boolean,
) => {
  if (key === 'key') {
  } else if (key[0] === 'o' && key[1] === 'n') {
    if (
      !((node.events || (node.events = {}))[(key = key.slice(2))] = newValue)
    ) {
      node.removeEventListener(key, listener);
    } else if (!oldValue) {
      node.addEventListener(key, listener);
    }
  } else if (!isSvg && key !== 'list' && key !== 'form' && key in node) {
    node[key] = newValue == null ? '' : newValue;
  } else if (newValue == null || newValue === false) {
    node.removeAttribute(key);
  } else {
    node.setAttribute(key, newValue);
  }
};

const createNode = (vdom: VNode, isSvg?: boolean) => {
  if (!vdom.props) {
    console.log(vdom);
  }
  const props = vdom.props;
  const node =
    vdom.type === TEXT_NODE
      ? document.createTextNode(vdom.tag)
      : (isSvg = isSvg || vdom.tag === 'svg')
      ? document.createElementNS(SVG_NS, vdom.tag, { is: props.is })
      : document.createElement(vdom.tag, { is: props.is });

  for (var k in props) {
    patchProperty(node, k, null, props[k], isSvg);
  }

  for (var i = 0; i < vdom.children.length; i++) {
    node.appendChild(
      createNode((vdom.children[i] = vdomify(vdom.children[i])), isSvg),
    );
  }

  return (vdom.node = node);
};

const patchNode = (
  parent: DomType,
  node: DomType,
  oldVNode: VNode,
  newVNode: VNode,
  isSvg?: boolean,
) => {
  if (oldVNode === newVNode) {
  } else if (
    oldVNode != null &&
    oldVNode.type === TEXT_NODE &&
    newVNode.type === TEXT_NODE
  ) {
    if (oldVNode.tag !== newVNode.tag) node.nodeValue = newVNode.tag;
  } else if (oldVNode == null || oldVNode.tag !== newVNode.tag) {
    node = parent.insertBefore(
      createNode((newVNode = vdomify(newVNode)), isSvg),
      node,
    );
    if (oldVNode != null) {
      parent.removeChild(oldVNode.node);
    }
  } else {
    var tmpVKid,
      oldVKid,
      oldKey,
      newKey,
      oldProps = oldVNode.props,
      newProps = newVNode.props,
      oldVKids = oldVNode.children,
      newVKids = newVNode.children,
      oldHead = 0,
      newHead = 0,
      oldTail = oldVKids.length - 1,
      newTail = newVKids.length - 1;

    isSvg = isSvg || newVNode.tag === 'svg';

    for (var i in { ...oldProps, ...newProps }) {
      if (
        (i === 'value' || i === 'selected' || i === 'checked'
          ? node[i]
          : oldProps[i]) !== newProps[i]
      ) {
        patchProperty(node, i, oldProps[i], newProps[i], isSvg);
      }
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if (
        (oldKey = getKey(oldVKids[oldHead])) == null ||
        oldKey !== getKey(newVKids[newHead])
      ) {
        break;
      }

      patchNode(
        node,
        oldVKids[oldHead].node,
        oldVKids[oldHead++],
        (newVKids[newHead] = vdomify(newVKids[newHead++])),
        isSvg,
      );
    }

    while (newHead <= newTail && oldHead <= oldTail) {
      if (
        (oldKey = getKey(oldVKids[oldTail])) == null ||
        oldKey !== getKey(newVKids[newTail])
      ) {
        break;
      }

      patchNode(
        node,
        oldVKids[oldTail].node,
        oldVKids[oldTail--],
        (newVKids[newTail] = vdomify(newVKids[newTail--])),
        isSvg,
      );
    }

    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        node.insertBefore(
          createNode((newVKids[newHead] = vdomify(newVKids[newHead++])), isSvg),
          (oldVKid = oldVKids[oldHead]) && oldVKid.node,
        );
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        node.removeChild(oldVKids[oldHead++].node);
      }
    } else {
      for (var keyed = {}, newKeyed = {}, i = oldHead; i <= oldTail; i++) {
        if ((oldKey = oldVKids[i].key) != null) {
          keyed[oldKey] = oldVKids[i];
        }
      }

      while (newHead <= newTail) {
        oldKey = getKey((oldVKid = oldVKids[oldHead]));
        newKey = getKey((newVKids[newHead] = vdomify(newVKids[newHead])));

        if (
          newKeyed[oldKey] ||
          (newKey != null && newKey === getKey(oldVKids[oldHead + 1]))
        ) {
          if (oldKey == null) {
            node.removeChild(oldVKid.node);
          }
          oldHead++;
          continue;
        }

        if (newKey == null || oldVNode.type === SSR_NODE) {
          if (oldKey == null) {
            patchNode(
              node,
              oldVKid && oldVKid.node,
              oldVKid,
              newVKids[newHead],
              isSvg,
            );
            newHead++;
          }
          oldHead++;
        } else {
          if (oldKey === newKey) {
            patchNode(node, oldVKid.node, oldVKid, newVKids[newHead], isSvg);
            newKeyed[newKey] = true;
            oldHead++;
          } else {
            if ((tmpVKid = keyed[newKey]) != null) {
              patchNode(
                node,
                node.insertBefore(tmpVKid.node, oldVKid && oldVKid.node),
                tmpVKid,
                newVKids[newHead],
                isSvg,
              );
              newKeyed[newKey] = true;
            } else {
              patchNode(
                node,
                oldVKid && oldVKid.node,
                null,
                newVKids[newHead],
                isSvg,
              );
            }
          }
          newHead++;
        }
      }

      while (oldHead <= oldTail) {
        if (getKey((oldVKid = oldVKids[oldHead++])) == null) {
          node.removeChild(oldVKid.node);
        }
      }

      for (var i in keyed) {
        if (newKeyed[i] == null) {
          node.removeChild(keyed[i].node);
        }
      }
    }
  }

  return (newVNode.node = node);
};

const vdomify = (newVNode: any) =>
  newVNode !== true && newVNode !== false && newVNode ? newVNode : text('');

const recycleNode = (node: DomType) =>
  node.nodeType === TEXT_NODE
    ? text(node.nodeValue, node)
    : createVNode(
        node.nodeName.toLowerCase(),
        EMPTY_OBJ,
        EMPTY_ARR.map.call(node.childNodes, recycleNode),
        SSR_NODE,
        node,
      );

function createVNode(
  tag: string,
  props: any,
  children: ChildrenType,
  type?: number,
  node?: DomType,
): VNode {
  return {
    tag,
    props,
    key: props.key,
    children,
    type,
    node,
  };
}

export const text = (value: string | number, node?: DomType) =>
  createVNode(String(value), EMPTY_OBJ, EMPTY_ARR, TEXT_NODE, node);

export const h = (tag: string, props: PropsType, ...children: VNode[]) =>
  createVNode(tag, props, children);

export const render = (node: DomType, vdom: ReactElement) => (
  ((node = patchNode(
    node.parentNode,
    node,
    node.vdom || recycleNode(node),
    vdom,
  )).vdom = vdom),
  node
);
