import { init, VNode } from './back';
import { htmlDomApi } from './dom'
export { render, h } from './react';
const patch = init(htmlDomApi);

export function realRender(container: Element & { vDom?: VNode }, vNode: VNode): VNode {
    let temp: VNode;
    if (container.vDom) {
        temp = patch(container.vDom as VNode, vNode);
    } else {
        temp = patch(patch(container, vNode), vNode);
    }
    container.vDom = temp;
    return temp;
}
