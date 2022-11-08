type ReactElement = VNode | string | null | undefined | number;
type KeyType = string | number;
export interface PropsType {
  className?: string;
  id?: string;
  children?: VNode[];
  dangerouslySetInnerHTML?: string;
  style?: string;
  key?: KeyType;
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
  children: VNode[];
  type?: number;
  node?: DomType;
}

export interface Component<T = {}> {
  (props: T, ...children: VNode[]): VNode;
  displayName: string;
}

type DomType = HTMLElement & { vdom?: VNode; events?: Record<string, any>; value?: any; selected?: boolean; checked?: boolean; };

const SSR_NODE = 1;
const TEXT_NODE = 3;
const EMPTY_OBJ = {};
const SVG_NS = 'http://www.w3.org/2000/svg';

const listener = function (event: any) {
  // @ts-ignore
  this.events[event.type](event);
};

const getKey = (vdom: VNode): KeyType | null => vdom?.props?.key ?? null;

const patchProperty = (
  node: DomType,
  key: string,
  oldValue: any,
  newValue: any,
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
    // @ts-ignore
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
    (vdom.type === TEXT_NODE
      ? document.createTextNode(vdom.tag)
      : (isSvg = isSvg || vdom.tag === 'svg')
        ? document.createElementNS(SVG_NS, vdom.tag, { is: props.is })
        : document.createElement(vdom.tag, { is: props.is })) as DomType;

  for (let k of Object.keys(props)) {
    patchProperty(node, k, null, props[k], isSvg);
  }

  for (let i = 0; i < vdom.children.length; i++) {
    node.appendChild(
      createNode((vdom.children[i] = vdomify(vdom.children[i])), isSvg),
    );
  }

  return (vdom.node = node);
};

const patchNode = (
  parentDom: DomType,
  containerDom: DomType,
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
    if (oldVNode.tag !== newVNode.tag) containerDom.nodeValue = newVNode.tag;
  } else if (oldVNode == null || oldVNode.tag !== newVNode.tag) {
    containerDom = parentDom.insertBefore(
      createNode((newVNode = vdomify(newVNode)), isSvg),
      containerDom,
    );
    if (oldVNode != null) {
      parentDom.removeChild(oldVNode.node!);
    }
  } else {
    let tmpVKid: VNode | null;
    let oldVKid: VNode | null;
    let oldKey: KeyType | null;
    let newKey: KeyType | null;
    let oldHead = 0
    let newHead = 0
    const oldProps = oldVNode.props
    const newProps = newVNode.props
    const oldVKids = oldVNode.children
    const newVKids = newVNode.children
    let oldTail = oldVKids.length - 1;
    let newTail = newVKids.length - 1;

    isSvg = isSvg || newVNode.tag === 'svg';

    for (let i of Object.keys({ ...oldProps, ...newProps })) {
      if (
        (i === 'value' || i === 'selected' || i === 'checked'
          ? containerDom[i]
          : oldProps[i]) !== newProps[i]
      ) {
        patchProperty(containerDom, i, oldProps[i], newProps[i], isSvg);
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
        containerDom,
        oldVKids[oldHead].node!,
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
        containerDom,
        oldVKids[oldTail].node!,
        oldVKids[oldTail--],
        (newVKids[newTail] = vdomify(newVKids[newTail--])),
        isSvg,
      );
    }

    if (oldHead > oldTail) {
      while (newHead <= newTail) {
        containerDom.insertBefore(
          createNode((newVKids[newHead] = vdomify(newVKids[newHead++])), isSvg),
          // @ts-ignore
          (oldVKid = oldVKids[oldHead]) && oldVKid.node,
        );
      }
    } else if (newHead > newTail) {
      while (oldHead <= oldTail) {
        containerDom.removeChild(oldVKids[oldHead++].node!);
      }
    } else {
      let newKeyed: Record<string | number, any> = {};
      let keyed: Record<string | number, any> = {};
      for (let i = oldHead; i <= oldTail; i++) {
        if ((oldKey = getKey(oldVKids[i])) != null) {
          keyed[oldKey] = oldVKids[i];
        }
      }

      while (newHead <= newTail) {
        oldKey = getKey((oldVKid = oldVKids[oldHead]));
        newKey = getKey((newVKids[newHead] = vdomify(newVKids[newHead])));

        if (
          // @ts-ignore
          newKeyed[oldKey] ||
          (newKey != null && newKey === getKey(oldVKids[oldHead + 1]))
        ) {
          if (oldKey == null) {
            containerDom.removeChild(oldVKid.node!);
          }
          oldHead++;
          continue;
        }

        if (newKey == null || oldVNode.type === SSR_NODE) {
          if (oldKey == null) {
            patchNode(
              containerDom,
              // @ts-ignore
              oldVKid?.node,
              oldVKid,
              newVKids[newHead],
              isSvg,
            );
            newHead++;
          }
          oldHead++;
        } else {
          if (oldKey === newKey) {
            patchNode(containerDom, oldVKid.node!, oldVKid, newVKids[newHead], isSvg);
            newKeyed[newKey] = true;
            oldHead++;
          } else {
            if ((tmpVKid = keyed[newKey]) != null) {
              patchNode(
                containerDom,
                // @ts-ignore
                containerDom.insertBefore(tmpVKid.node, oldVKid?.node),
                tmpVKid,
                newVKids[newHead],
                isSvg,
              );
              newKeyed[newKey] = true;
            } else {
              patchNode(
                containerDom,
                // @ts-ignore
                oldVKid?.node,
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
          containerDom.removeChild(oldVKid.node!);
        }
      }

      for (let i of Object.keys(keyed)) {
        if (newKeyed[i] == null) {
          containerDom.removeChild(keyed[i].node);
        }
      }
    }
  }

  return (newVNode.node = containerDom);
};

const vdomify = (newVNode: any) =>
  newVNode !== true && newVNode !== false && newVNode ? newVNode : text('');

const recycleNode = (node: DomType): VNode =>
  node.nodeType === TEXT_NODE
    ? text(node.nodeValue!, node)
    : createVNode(
      node.nodeName.toLowerCase(),
      EMPTY_OBJ,
      [].map.call(node.childNodes, recycleNode) as VNode[],
      SSR_NODE,
      node,
    );

function createVNode(
  tag: string,
  props: any,
  children: VNode[],
  type?: number,
  node?: DomType,
): VNode {
  return {
    tag,
    props,
    children,
    type,
    node,
  };
}

export const text = (value: string | number, node?: DomType) =>
  createVNode(String(value), EMPTY_OBJ, [], TEXT_NODE, node);

export const h = (tag: string, props: PropsType, ...children: ReactElement[]) => {
  const result: VNode[] = [];
  for (const item of children) {
    if (typeof item == 'string' || typeof item === 'number') {
      result.push(text(item))
    } else if (item && typeof item === 'object') {
      result.push(item)
    }
  }
  return createVNode(tag, props, result)
}

export const render = (node: DomType, vdom: VNode) => {
  const result = patchNode(
    node.parentNode! as DomType,
    node,
    node.vdom || recycleNode(node),
    vdom,
  )
  result.vdom = vdom;
  return result;
}
