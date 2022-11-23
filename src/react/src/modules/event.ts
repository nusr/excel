import { VNode, Listener } from '../vNode';
import { Module } from './module';

export type On = {
  [N in keyof HTMLElementEventMap]?: Listener<HTMLElementEventMap[N]>;
} & {
  [event: string]: Listener<any>;
};

type SomeListener<N extends keyof HTMLElementEventMap> =
  | Listener<HTMLElementEventMap[N]>
  | Listener<any>;

function invokeHandler<N extends keyof HTMLElementEventMap>(
  handler: SomeListener<N> | Array<SomeListener<N>>,
  vNode: VNode,
  event?: Event,
): void {
  if (typeof handler === 'function') {
    const temp: any = event || {};
    // call function handler
    handler.call(vNode, temp, vNode);
  } else if (typeof handler === 'object') {
    // call multiple handlers
    for (let i = 0; i < handler.length; i++) {
      invokeHandler(handler[i], vNode, event);
    }
  }
}

function handleEvent(event: Event, vNode: VNode) {
  const name = event.type;
  const on: any = vNode.data?.on;

  // call event handler(s) if exists
  if (on && on[name]) {
    invokeHandler(on[name], vNode, event);
  }
}

function createListener() {
  return function handler(event: Event) {
    handleEvent(event, (handler as any).vNode);
  };
}

function updateEventListeners(oldVNode: VNode, vNode?: VNode): void {
  const oldOn: any = oldVNode.data?.on;
  const oldListener = (oldVNode as any).listener;
  const oldElm: Element = oldVNode.elm as Element;
  const on: any = vNode?.data?.on;
  const elm: Element = (vNode && vNode.elm) as Element;
  let name: string;

  // optimization for reused immutable handlers
  if (oldOn === on) {
    return;
  }

  // remove existing listeners which no longer used
  if (oldOn && oldListener) {
    // if element changed or deleted we remove all existing listeners unconditionally
    if (!on) {
      for (name in oldOn) {
        // remove listener if element was changed or existing listeners removed
        oldElm.removeEventListener(name, oldListener, false);
      }
    } else {
      for (name in oldOn) {
        // remove listener if existing listener removed
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      }
    }
  }

  // add new listeners which has not already attached
  if (on) {
    // reuse existing listener or create new
    const listener = ((vNode as any).listener =
      (oldVNode as any).listener || createListener());
    // update vNode for listener
    listener.vNode = vNode;

    // if element changed or added we add all needed listeners unconditionally
    if (!oldOn) {
      for (name in on) {
        // add listener if element was changed or new listeners added
        elm.addEventListener(name, listener, false);
      }
    } else {
      for (name in on) {
        // add listener if new listener added
        if (!oldOn[name]) {
          elm.addEventListener(name, listener, false);
        }
      }
    }
  }
}

export const eventListenersModule: Module = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners,
};
