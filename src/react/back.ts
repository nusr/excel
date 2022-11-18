
import type { DOMAPI } from "./dom";
export interface VNode {
    tag: string | undefined;
    data: VNodeData | undefined;
    children: Array<VNode> | undefined;
    dom: Node | undefined;
    text: string | undefined;
    key: string | undefined;
}
type VNodeStyle = Record<string, string>;

type Listener<T> = (this: VNode, ev: T, vNode: VNode) => void;

type On = {
    [N in keyof HTMLElementEventMap as N extends string ? `on${N}` : never]?:
    Listener<HTMLElementEventMap[N]>
}

interface VNodeData extends On {
    className?: string;
    style?: VNodeStyle;
    key?: string;
    ns?: string; // for SVGs
    is?: string; // for custom elements v1
}


export function h(
    sel: string,
    data: VNodeData,
    children?: Array<VNode | string | null | undefined | number>,
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
        tag: sel,
        data,
        key,
        dom: elm,
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


function sameVNode(oldNode: VNode, newNode: VNode): boolean {
    const isSameKey = oldNode.key === newNode.key;
    const isSameIs = oldNode.data?.is === newNode.data?.is;
    const isSameSel = oldNode.tag === newNode.tag;
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
    function createElm(vNode: VNode): Node {
        let data = vNode.data;
        const children = vNode.children;
        const sel = vNode.tag;
        if (sel) {
            let elm: Element;
            if (data?.ns) {
                elm = api.createElementNS(data.ns, sel, data);
            } else {
                elm = api.createElement(sel, data);
            }
            vNode.dom = elm;
            if (Array.isArray(children) && children.length > 0) {
                for (let i = 0; i < children.length; ++i) {
                    const ch = children[i];
                    if (ch) {
                        api.appendChild(elm, createElm(ch));
                    }
                }
            } else if (vNode.text) {
                api.appendChild(elm, api.createTextNode(vNode.text));
            }
        } else {
            vNode.dom = api.createTextNode(vNode.text!);
        }
        return vNode.dom;
    }

    function addVNodes(
        parentElm: Node,
        before: Node | null,
        vNodes: VNode[],
        startIdx: number,
        endIdx: number,
    ) {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vNodes[startIdx];
            if (ch) {
                api.insertBefore(parentElm, createElm(ch), before);
            }
        }
    }

    function removeVNodes(
        parentElm: Node,
        vNodes: VNode[],
        startIdx: number,
        endIdx: number
    ): void {
        for (; startIdx <= endIdx; ++startIdx) {
            const ch = vNodes[startIdx];
            if (ch.children) {
                removeVNodes(
                    parentElm,
                    ch.children,
                    0,
                    ch.children.length - 1
                );
            }
            api.removeChild(parentElm, ch.dom!);
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
                patchVNode(oldStartVNode, newStartVNode);
                oldStartVNode = oldCh[++oldStartIdx];
                newStartVNode = newCh[++newStartIdx];
            } else if (sameVNode(oldEndVNode, newEndVNode)) {
                patchVNode(oldEndVNode, newEndVNode);
                oldEndVNode = oldCh[--oldEndIdx];
                newEndVNode = newCh[--newEndIdx];
            } else if (sameVNode(oldStartVNode, newEndVNode)) {
                // VNode moved right
                patchVNode(oldStartVNode, newEndVNode);
                api.insertBefore(
                    parentElm,
                    oldStartVNode.dom!,
                    api.nextSibling(oldEndVNode.dom!)
                );
                oldStartVNode = oldCh[++oldStartIdx];
                newEndVNode = newCh[--newEndIdx];
            } else if (sameVNode(oldEndVNode, newStartVNode)) {
                // VNode moved left
                patchVNode(oldEndVNode, newStartVNode);
                api.insertBefore(parentElm, oldEndVNode.dom!, oldStartVNode.dom!);
                oldEndVNode = oldCh[--oldEndIdx];
                newStartVNode = newCh[++newStartIdx];
            } else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVNode.key as string];
                if (idxInOld === undefined) {
                    // New element
                    api.insertBefore(
                        parentElm,
                        createElm(newStartVNode),
                        oldStartVNode.dom!
                    );
                } else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.tag !== newStartVNode.tag) {
                        api.insertBefore(
                            parentElm,
                            createElm(newStartVNode),
                            oldStartVNode.dom!
                        );
                    } else {
                        patchVNode(elmToMove, newStartVNode);
                        oldCh[idxInOld] = undefined as any;
                        api.insertBefore(parentElm, elmToMove.dom!, oldStartVNode.dom!);
                    }
                }
                newStartVNode = newCh[++newStartIdx];
            }
        }

        if (newStartIdx <= newEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].dom;
            addVNodes(
                parentElm,
                before,
                newCh,
                newStartIdx,
                newEndIdx,
            );
        }
        if (oldStartIdx <= oldEndIdx) {
            removeVNodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }

    function patchVNode(
        oldVNode: VNode,
        vNode: VNode,
    ) {
        const elm = (vNode.dom = oldVNode.dom)!;
        if (oldVNode === vNode) return;
        const oldCh = oldVNode.children;
        const ch = vNode.children;
        if (vNode.text === undefined) {
            if (oldCh && ch && oldCh !== ch) {
                updateChildren(elm, oldCh, ch);
            } else if (ch) {
                if (oldVNode.text) api.setTextContent(elm, "");
                addVNodes(elm, null, ch, 0, ch.length - 1);
            } else if (oldCh) {
                removeVNodes(elm, oldCh, 0, oldCh.length - 1);
            } else if (oldVNode.text) {
                api.setTextContent(elm, "");
            }
        } else if (oldVNode.text !== vNode.text) {
            if (oldCh) {
                removeVNodes(elm, oldCh, 0, oldCh.length - 1);
            }
            api.setTextContent(elm, vNode.text!);
        }
    }

    return function patch(
        oldVNode: VNode | Element,
        vNode: VNode
    ): VNode {
        let elm: Node;
        let parent: Node;

        if (api.isElement(oldVNode)) {
            oldVNode = emptyNodeAt(oldVNode);
        }

        if (sameVNode(oldVNode, vNode)) {
            patchVNode(oldVNode, vNode);
        } else {
            elm = oldVNode.dom!;
            parent = api.parentNode(elm) as Node;
            createElm(vNode);
            if (parent !== null) {
                api.insertBefore(parent, vNode.dom!, api.nextSibling(elm));
                api.removeChild(parent, oldVNode.dom!)
            }
        }
        return vNode;
    };
}
