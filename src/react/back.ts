
import type { DOMAPI } from "./htmldomapi";
export interface VNode {
    sel: string | undefined;
    data: VNodeData | undefined;
    children: Array<VNode> | undefined;
    elm: Node | undefined;
    text: string | undefined;
    key: string | undefined;
  }
  export type VNodeStyle = Record<string, string> & {
    delayed?: Record<string, string>;
    remove?: Record<string, string>;
  }
  
  type Listener<T> = (this: VNode, ev: T, vnode: VNode) => void;
  
  export type On = {
    [N in keyof HTMLElementEventMap]?:
    | Listener<HTMLElementEventMap[N]>
    | Array<Listener<HTMLElementEventMap[N]>>;
  } & {
    [event: string]: Listener<any> | Array<Listener<any>>;
  };
  
  export interface AttachData {
    [key: string]: any;
    [i: number]: any;
    placeholder?: any;
    real?: Node;
  }
  
  export interface VNodeData {
    class?: string;
    style?: VNodeStyle;
    on?: On;
    key?: string;
    ns?: string; // for SVGs
    is?: string; // for custom elements v1
    [key: string]: any; // for any other 3rd party module
  }
  

export function h(
    sel: string,
    data: VNodeData,
    children?: Array<VNode | string | null | undefined | number> ,
    elm?: Element | Text 
): VNode {
    const key = data === undefined ? undefined : String(data.key);
    const nodeList: VNode[] = [];
    const textList: string[] = []
    const list = children || []
    for (const item of list) {
        if (typeof item === 'string' || typeof item === 'number') {
            const t = String(item);
            if (t) {
                textList.push(t)
            }
        } else if (item && typeof item === 'object') {
            nodeList.push(item)
        }
    }
    const result: VNode = {
        sel,
        data,
        key,
        elm,
        children: undefined,
        text: undefined,
    }
    if (textList.length > 0 && nodeList.length > 0) {
        throw new Error('error node')
    }
    if (textList.length > 0) {
        result.text = textList.join(' ')
    }
    if (nodeList.length > 0) {
        result.children = nodeList;
    }
    return result;
}


function sameVnode(oldNode: VNode, newNode: VNode): boolean {
    const isSameKey = oldNode.key === newNode.key;
    const isSameIs = oldNode.data?.is === newNode.data?.is;
    const isSameSel = oldNode.sel === newNode.sel;
    return isSameSel && isSameKey && isSameIs;
}

type KeyToIndexMap = { [key: string]: number };

function createKeyToOldIdx(
    children: VNode[],
    beginIdx: number,
    endIdx: number
): KeyToIndexMap {
    const map: KeyToIndexMap = {};
    for (let i = beginIdx; i <= endIdx; ++i) {
        const key = children[i]?.key;
        if (key) {
            map[key] = i;
        }
    }
    return map;
}


export function init(
    api: DOMAPI,
) {


    function emptyNodeAt(elm: Element) {
        return h(
            api.tagName(elm).toLowerCase(),
            {},
            [],
            elm
        );
    }
    function createElm(vnode: VNode): Node {
        let data = vnode.data;
        const children = vnode.children;
        const sel = vnode.sel;
        if (sel) {
            let elm: Element;
            if (data?.ns) {
                elm = api.createElementNS(data.ns, sel, data);
            } else {
                elm = api.createElement(sel, data);
            }
            vnode.elm = elm;
            if (Array.isArray(children) && children.length > 0) {
                for (let i = 0; i < children.length; ++i) {
                    const ch = children[i];
                    if (ch) {
                        api.appendChild(elm, createElm(ch));
                    }
                }
            } else if (vnode.text) {
                api.appendChild(elm, api.createTextNode(vnode.text));
            }
        } else {
            vnode.elm = api.createTextNode(vnode.text!);
        }
        return vnode.elm;
    }

    function addVnodes(
        parentElm: Node,
        before: Node | null,
        vnodes: VNode[],
        startIdx: number,
        endIdx: number,
    ) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (ch) {
                api.insertBefore(parentElm, createElm(ch), before);
            }
        }
    }

    function removeVnodes(
        parentElm: Node,
        vnodes: VNode[],
        startIdx: number,
        endIdx: number
    ): void {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vnodes[startIdx];
            if (ch.children) {
                removeVnodes(
                    parentElm,
                    ch.children,
                    0,
                    ch.children.length - 1
                );
            }
            api.removeChild(parentElm, ch.elm!);
        }
    }

    function updateChildren(
        parentElm: Node,
        oldCh: VNode[],
        newCh: VNode[],
    ) {
        let oldStartIdx = 0;
        let newStartIdx = 0;
        let oldEndIdx = oldCh.length - 1;
        let oldStartVnode = oldCh[0];
        let oldEndVnode = oldCh[oldEndIdx];
        let newEndIdx = newCh.length - 1;
        let newStartVnode = newCh[0];
        let newEndVnode = newCh[newEndIdx];
        let oldKeyToIdx: KeyToIndexMap | undefined;
        let idxInOld: number;
        let elmToMove: VNode;
        let before: any;

        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            } else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            } else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            } else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            } else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldStartVnode, newEndVnode)) {
                // Vnode moved right
                patchVnode(oldStartVnode, newEndVnode);
                api.insertBefore(
                    parentElm,
                    oldStartVnode.elm!,
                    api.nextSibling(oldEndVnode.elm!)
                );
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            } else if (sameVnode(oldEndVnode, newStartVnode)) {
                // Vnode moved left
                patchVnode(oldEndVnode, newStartVnode);
                api.insertBefore(parentElm, oldEndVnode.elm!, oldStartVnode.elm!);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            } else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key as string];
                if (idxInOld === undefined) {
                    // New element
                    api.insertBefore(
                        parentElm,
                        createElm(newStartVnode),
                        oldStartVnode.elm!
                    );
                } else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(
                            parentElm,
                            createElm(newStartVnode),
                            oldStartVnode.elm!
                        );
                    } else {
                        patchVnode(elmToMove, newStartVnode);
                        oldCh[idxInOld] = undefined as any;
                        api.insertBefore(parentElm, elmToMove.elm!, oldStartVnode.elm!);
                    }
                }
                newStartVnode = newCh[++newStartIdx];
            }
        }

        if (newStartIdx <= newEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
            addVnodes(
                parentElm,
                before,
                newCh,
                newStartIdx,
                newEndIdx,
            );
        }
        if (oldStartIdx <= oldEndIdx) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }

    function patchVnode(
        oldVnode: VNode,
        vnode: VNode,
    ) {
        const elm = (vnode.elm = oldVnode.elm)!;
        if (oldVnode === vnode) return;
        const oldCh = oldVnode.children;
        const ch = vnode.children;
        if (vnode.text === undefined) {
            if (oldCh && ch && oldCh !== ch) {
                updateChildren(elm, oldCh, ch);
            } else if (ch) {
                if (oldVnode.text) api.setTextContent(elm, "");
                addVnodes(elm, null, ch, 0, ch.length - 1);
            } else if (oldCh) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            } else if (oldVnode.text) {
                api.setTextContent(elm, "");
            }
        } else if (oldVnode.text !== vnode.text) {
            if (oldCh) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            api.setTextContent(elm, vnode.text!);
        }
    }

    return function patch(
        oldVnode: VNode | Element,
        vnode: VNode
    ): VNode {
        let elm: Node;
        let parent: Node;

        if (api.isElement(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }

        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode);
        } else {
            elm = oldVnode.elm!;
            parent = api.parentNode(elm) as Node;
            createElm(vnode);
            if (parent !== null) {
                api.insertBefore(parent, vnode.elm!, api.nextSibling(elm));
                api.removeChild(parent, oldVnode.elm!)
            }
        }
        return vnode;
    };
}
