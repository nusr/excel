import { Module } from './modules/module';
import { VNode } from './vNode';
import { htmlDomApi, DOMOperation } from './dom';
import { h } from './h';

type NonUndefined<T> = T extends undefined ? never : T;

function isUndef(s: any): boolean {
  return s === undefined;
}
function isDef<A>(s: A): s is NonUndefined<A> {
  return s !== undefined;
}

type VNodeQueue = VNode[];

const emptyNode = h('', {});

function sameVNode(vNode1: VNode, vNode2: VNode): boolean {
  const isSameKey = vNode1.key === vNode2.key;
  const isSameIs = vNode1.data?.is === vNode2.data?.is;
  const isSameSel = vNode1.sel === vNode2.sel;
  const isSameTextOrFragment =
    !vNode1.sel && vNode1.sel === vNode2.sel
      ? typeof vNode1.text === typeof vNode2.text
      : true;

  return isSameSel && isSameKey && isSameIs && isSameTextOrFragment;
}

function isElement(
  api: DOMOperation,
  vNode: Element | VNode,
): vNode is Element {
  return api.isElement(vNode as any);
}

type KeyToIndexMap = { [key: string]: number };

type ArraysOf<T> = {
  [K in keyof T]: Array<T[K]>;
};

type ModuleHooks = ArraysOf<Required<Module>>;

function createKeyToOldIdx(
  children: VNode[],
  beginIdx: number,
  endIdx: number,
): KeyToIndexMap {
  const map: KeyToIndexMap = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = children[i]?.key;
    if (key !== undefined) {
      map[key as string] = i;
    }
  }
  return map;
}

const hooks: Array<keyof Module> = [
  'create',
  'update',
  'remove',
  'destroy',
  'pre',
  'post',
];

// TODO Should `domApi` be put into this in the next major version bump?
export type Options = {
  experimental?: {
    fragments?: boolean;
  };
};

export function init(modules: Array<Partial<Module>>, domApi?: DOMOperation) {
  const cbs: ModuleHooks = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [],
  };

  const api: DOMOperation = domApi !== undefined ? domApi : htmlDomApi;

  for (const hook of hooks) {
    for (const module of modules) {
      const currentHook = module[hook];
      if (currentHook !== undefined) {
        (cbs[hook] as any[]).push(currentHook);
      }
    }
  }

  function createRmCb(childElm: Node, listeners: number) {
    return function rmCb() {
      if (--listeners === 0) {
        const parent = api.parentNode(childElm) as Node;
        api.removeChild(parent, childElm);
      }
    };
  }

  function createElm(vNode: VNode, insertedVNodeQueue: VNodeQueue): Node {
    let i: any;
    let data = vNode.data;
    if (data !== undefined) {
      const init = data.hook?.init;
      if (init) {
        init(vNode);
        data = vNode.data;
      }
    }
    const children = vNode.children;
    const sel = vNode.sel;
    if (sel !== undefined) {
      const elm = (vNode.elm =
        isDef(data) && isDef((i = data.ns))
          ? api.createElementNS(i, sel, data)
          : api.createElement(sel, data));
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vNode);
      if (Array.isArray(children) && children.length > 0) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i];
          if (ch != null) {
            api.appendChild(elm, createElm(ch as VNode, insertedVNodeQueue));
          }
        }
      } else if (
        typeof vNode.text === 'string' ||
        typeof vNode.text === 'number'
      ) {
        api.appendChild(elm, api.createTextNode(vNode.text));
      }
      const hook = vNode.data!.hook;
      if (isDef(hook)) {
        hook.create?.(emptyNode, vNode);
        if (hook.insert) {
          insertedVNodeQueue.push(vNode);
        }
      }
    } else {
      vNode.elm = api.createTextNode(vNode.text!);
    }
    return vNode.elm;
  }

  function addVNodes(
    parentElm: Node,
    before: Node | null,
    vNodes: VNode[],
    startIdx: number,
    endIdx: number,
    insertedVNodeQueue: VNodeQueue,
  ) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vNodes[startIdx];
      if (ch != null) {
        api.insertBefore(parentElm, createElm(ch, insertedVNodeQueue), before);
      }
    }
  }

  function invokeDestroyHook(vNode: VNode) {
    const data = vNode.data;
    if (data !== undefined) {
      data?.hook?.destroy?.(vNode);
      for (let i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vNode);
      if (vNode.children !== undefined) {
        for (let j = 0; j < vNode.children.length; ++j) {
          const child = vNode.children[j];
          if (child != null && typeof child !== 'string') {
            invokeDestroyHook(child);
          }
        }
      }
    }
  }

  function removeVNodes(
    parentElm: Node,
    vNodes: VNode[],
    startIdx: number,
    endIdx: number,
  ): void {
    for (; startIdx <= endIdx; ++startIdx) {
      let listeners: number;
      let rm: () => void;
      const ch = vNodes[startIdx];
      if (ch != null) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm!, listeners);
          for (let i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
          const removeHook = ch?.data?.hook?.remove;
          if (isDef(removeHook)) {
            removeHook(ch, rm);
          } else {
            rm();
          }
        } else if (ch.children) {
          // Fragment node
          invokeDestroyHook(ch);
          removeVNodes(
            parentElm,
            ch.children as VNode[],
            0,
            ch.children.length - 1,
          );
        } else {
          // Text node
          api.removeChild(parentElm, ch.elm!);
        }
      }
    }
  }

  function updateChildren(
    parentElm: Node,
    oldCh: VNode[],
    newCh: VNode[],
    insertedVNodeQueue: VNodeQueue,
  ) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVNode = oldCh[0];
    let oldEndVNode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVNode = newCh[0];
    let newEndVNode = newCh[newEndIdx];
    let oldKeyToIdx: KeyToIndexMap | undefined;
    let idxInOld: number;
    let elmToMove: VNode;
    let before: any;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVNode == null) {
        oldStartVNode = oldCh[++oldStartIdx]; // VNode might have been moved left
      } else if (oldEndVNode == null) {
        oldEndVNode = oldCh[--oldEndIdx];
      } else if (newStartVNode == null) {
        newStartVNode = newCh[++newStartIdx];
      } else if (newEndVNode == null) {
        newEndVNode = newCh[--newEndIdx];
      } else if (sameVNode(oldStartVNode, newStartVNode)) {
        patchVNode(oldStartVNode, newStartVNode, insertedVNodeQueue);
        oldStartVNode = oldCh[++oldStartIdx];
        newStartVNode = newCh[++newStartIdx];
      } else if (sameVNode(oldEndVNode, newEndVNode)) {
        patchVNode(oldEndVNode, newEndVNode, insertedVNodeQueue);
        oldEndVNode = oldCh[--oldEndIdx];
        newEndVNode = newCh[--newEndIdx];
      } else if (sameVNode(oldStartVNode, newEndVNode)) {
        // vNode moved right
        patchVNode(oldStartVNode, newEndVNode, insertedVNodeQueue);
        api.insertBefore(
          parentElm,
          oldStartVNode.elm!,
          api.nextSibling(oldEndVNode.elm!),
        );
        oldStartVNode = oldCh[++oldStartIdx];
        newEndVNode = newCh[--newEndIdx];
      } else if (sameVNode(oldEndVNode, newStartVNode)) {
        // vNode moved left
        patchVNode(oldEndVNode, newStartVNode, insertedVNodeQueue);
        api.insertBefore(parentElm, oldEndVNode.elm!, oldStartVNode.elm!);
        oldEndVNode = oldCh[--oldEndIdx];
        newStartVNode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVNode.key as string];
        if (isUndef(idxInOld)) {
          // New element
          api.insertBefore(
            parentElm,
            createElm(newStartVNode, insertedVNodeQueue),
            oldStartVNode.elm!,
          );
        } else {
          elmToMove = oldCh[idxInOld];
          if (elmToMove.sel !== newStartVNode.sel) {
            api.insertBefore(
              parentElm,
              createElm(newStartVNode, insertedVNodeQueue),
              oldStartVNode.elm!,
            );
          } else {
            patchVNode(elmToMove, newStartVNode, insertedVNodeQueue);
            oldCh[idxInOld] = undefined as any;
            api.insertBefore(parentElm, elmToMove.elm!, oldStartVNode.elm!);
          }
        }
        newStartVNode = newCh[++newStartIdx];
      }
    }

    if (newStartIdx <= newEndIdx) {
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
      addVNodes(
        parentElm,
        before,
        newCh,
        newStartIdx,
        newEndIdx,
        insertedVNodeQueue,
      );
    }
    if (oldStartIdx <= oldEndIdx) {
      removeVNodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVNode(
    oldVNode: VNode,
    vNode: VNode,
    insertedVNodeQueue: VNodeQueue,
  ) {
    const hook = vNode.data?.hook;
    hook?.prePatch?.(oldVNode, vNode);
    const elm = (vNode.elm = oldVNode.elm)!;
    if (oldVNode === vNode) return;
    if (
      vNode.data !== undefined ||
      (isDef(vNode.text) && vNode.text !== oldVNode.text)
    ) {
      vNode.data ??= {};
      oldVNode.data ??= {};
      for (let i = 0; i < cbs.update.length; ++i)
        cbs.update[i](oldVNode, vNode);
      vNode.data?.hook?.update?.(oldVNode, vNode);
    }
    const oldCh = oldVNode.children as VNode[];
    const ch = vNode.children as VNode[];
    if (isUndef(vNode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVNodeQueue);
      } else if (isDef(ch)) {
        if (isDef(oldVNode.text)) api.setTextContent(elm, '');
        addVNodes(elm, null, ch, 0, ch.length - 1, insertedVNodeQueue);
      } else if (isDef(oldCh)) {
        removeVNodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVNode.text)) {
        api.setTextContent(elm, '');
      }
    } else if (oldVNode.text !== vNode.text) {
      if (isDef(oldCh)) {
        removeVNodes(elm, oldCh, 0, oldCh.length - 1);
      }
      api.setTextContent(elm, vNode.text!);
    }
    hook?.postPatch?.(oldVNode, vNode);
    if (hook?.ref) {
      hook?.ref(vNode.elm! as Element);
    }
  }

  function patch(oldVNode: VNode | Element, vNode: VNode): VNode {
    let i: number, elm: Node, parent: Node;
    const insertedVNodeQueue: VNodeQueue = [];
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    if (isElement(api, oldVNode)) {
      createElm(vNode, insertedVNodeQueue);
      api.appendChild(oldVNode, vNode.elm!);
      return vNode;
    }

    if (sameVNode(oldVNode, vNode)) {
      patchVNode(oldVNode, vNode, insertedVNodeQueue);
    } else {
      elm = oldVNode.elm!;
      parent = api.parentNode(elm) as Node;

      createElm(vNode, insertedVNodeQueue);

      if (parent !== null) {
        api.insertBefore(parent, vNode.elm!, api.nextSibling(elm));
        removeVNodes(parent, [oldVNode], 0, 0);
      }
    }

    for (i = 0; i < insertedVNodeQueue.length; ++i) {
      insertedVNodeQueue[i].data!.hook!.insert!(insertedVNodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    return vNode;
  }
  return patch;
}
