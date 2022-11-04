type ForceUpdateType = () => void;
type ChildrenType = Array<VNode | string>;
export interface PropsType {
  className?: string;
  id?: string;
  children?: ChildrenType;
  dangerouslySetInnerHTML?: string;
  style?: string;
  [key: string]: any;
}
export type Component<T = PropsType> = (
  props: T & PropsType,
  children: ChildrenType,
  forceUpdate: ForceUpdateType,
) => VNode;
type ElementType = string | Component<any>;
interface HooksType {
  value: any;
  cb?: () => ForceUpdateType | void;
  cleanup?: ForceUpdateType | void;
}

export interface VNode {
  element: ElementType;
  props: PropsType;
  children: ChildrenType;
}

export function h<T extends PropsType>(
  element: ElementType,
  props: T,
  ...children: ChildrenType
): VNode {
  return { element, props, children };
}

export const x = (strings: TemplateStringsArray, ...fields: any[]) => {
  // Stack of nested tags. Start with a fake top node. The actual top virtual
  // node would become the first child of this node.
  const stack: VNode[] = [h('div', {})];
  // Three distinct parser states: text between the tags, open tag with
  // attributes and closing tag. Parser starts in text mode.
  const MODE_TEXT = 0;
  const MODE_OPEN_TAG = 1;
  const MODE_CLOSE_TAG = 2;
  let mode = MODE_TEXT;
  // Read and return the next word from the string, starting at position i. If
  // the string is empty - return the corresponding placeholder field.
  const readToken = (s: string, i: number, regexp: RegExp, field: any) => {
    s = s.substring(i);
    if (!s) {
      return [s, field];
    }
    const m = s.match(regexp) || [];
    return [s.substring(m[0].length), m[1]];
  };
  strings.forEach((s, i) => {
    while (s) {
      let val;
      s = s.trimStart();
      switch (mode) {
        case MODE_TEXT:
          // In text mode, we expect either `</` (closing tag) or `<` (opening tag), or raw text.
          // Depending on what we found, switch parser mode. For opening tag - push a new h() node
          // to the stack.
          if (s[0] === '<') {
            if (s[1] === '/') {
              [s] = readToken(s, 2, /^(\w+)/, fields[i]);
              mode = MODE_CLOSE_TAG;
            } else {
              [s, val] = readToken(s, 1, /^(\w+)/, fields[i]);
              stack.push(h(val, {}));
              mode = MODE_OPEN_TAG;
            }
          } else {
            [s, val] = readToken(s, 0, /^([^<]+)/, '');
            stack[stack.length - 1].children.push(val);
          }
          break;
        case MODE_OPEN_TAG:
          // Within the opening tag, look for `/>` (self-closing tag), or just
          // `>`, or attribute key/value pair. Switch mode back to "text" when
          // tag is ended. For attributes, put key/value pair to the properties
          // map of the top-level node from the stack.
          if (s[0] === '/' && s[1] === '>') {
            stack[stack.length - 2].children.push(stack.pop()!);
            mode = MODE_TEXT;
            s = s.substring(2);
          } else if (s[0] === '>') {
            mode = MODE_TEXT;
            s = s.substring(1);
          } else {
            [s, val] = readToken(s, 0, /^([\w-]+)=/, '');
            console.assert(val);
            let propName = val;
            [s, val] = readToken(s, 0, /^"([^"]*)"/, fields[i]);
            stack[stack.length - 1].props[propName] = val;
          }
          break;
        case MODE_CLOSE_TAG:
          // In closing tag mode we only look for the `>` to switch back to the
          // text mode. Top level node is popped from the stack and appended to
          // the children array of the next node from the stack.
          console.assert(s[0] === '>');
          stack[stack.length - 2].children.push(stack.pop()!);
          s = s.substring(1);
          mode = MODE_TEXT;
          break;
      }
    }
    if (mode === MODE_TEXT) {
      stack[stack.length - 1].children = stack[
        stack.length - 1
      ].children.concat(fields[i]);
    }
  });
  return stack[0].children[0] as VNode;
};

// Global array of hooks for the current functional component
let hooks: HooksType[];
// Global index of the current hook in the array of hooks above
let index = 0;
// Function, that forces an update of the current component
let forceUpdate: ForceUpdateType;
// Returns an existing hook at the current index for the current component, or
// creates a new one.
const getHook = (value: any) => {
  let hook = hooks[index++];
  if (!hook) {
    hook = { value };
    hooks.push(hook);
  }
  return hook;
};
export type SetStateAction<S> = S | ((prevState: S) => S);
export type ReducerAction<R extends Reducer<any, any>> = R extends Reducer<
  any,
  infer A
>
  ? A
  : never;
export type Dispatch<A> = (value: A) => void;
export type ReducerState<R extends Reducer<any, any>> = R extends Reducer<
  infer S,
  any
>
  ? S
  : never;
export type Reducer<S, A> = (prevState: S, action: A) => S;
export function useReducer<R extends Reducer<any, any>, I>(
  reducer: R,
  initialState: I & ReducerState<R>,
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const hook = getHook(initialState);
  const update = forceUpdate;
  const dispatch = (action: any) => {
    hook.value = reducer(hook.value, action);
    update();
  };
  return [hook.value, dispatch];
}

export function useState<S>(
  initialState: S | (() => S),
): [S, Dispatch<SetStateAction<S>>] {
  return useReducer((_, v) => v, initialState);
}

export const useEffect = (cb: HooksType['cb'], args = []) => {
  const hook = getHook(undefined);
  if (changed(hook.value, args)) {
    hook.value = args;
    hook.cb = cb;
  }
};

const changed = (a: any[], b: any[]) =>
  !a || a.length !== b.length || b.some((arg, i) => arg !== a[i]);

export const render = (
  list: VNode | Array<VNode>,
  dom: Element & { h?: Record<string, HooksType[]> },
  ns: string = '',
) => {
  // Make vlist always an array, even if it's a single node.
  const nodeList: Array<VNode> = Array.isArray(list) ? list : [list];
  // Unique implicit keys counter for un-keyed nodes
  const ids = new Map<any, number>();
  // Current hooks storage
  const hs: Record<string, HooksType[]> = dom.h || {};
  // Erase hooks storage
  dom.h = {};
  for (let i = 0; i < nodeList.length; i++) {
    let v = nodeList[i];
    const createNode = () => {
      if (typeof v === 'string') {
        return document.createTextNode(v);
      }
      if (v?.props?.dangerouslySetInnerHTML) {
        const template = document.createElement('span');
        template.innerHTML = v.props.dangerouslySetInnerHTML;
        return template.childNodes[0];
      }
      if (nsURI) {
        return document.createElementNS(nsURI, v.element as string);
      } else {
        return document.createElement(v.element as string);
      }
    };
    // Current component re-rendering function (global, used by some hooks).
    forceUpdate = () => render(nodeList, dom);
    while (v.element && typeof v.element === 'function') {
      // Key, explicit v property or implicit auto-incremented key
      const oldKey = ids.get(v.element) || 1;
      const k = (v.props && v.props.k) || '' + v.element + (oldKey + 1);
      ids.set(v.element, oldKey + 1);
      hooks = hs[k] || [];
      index = 0;
      v = v.element(v.props, v.children, forceUpdate);
      // Put current hooks into the new hooks storage
      // @ts-ignore
      dom.h[k] = hooks;
    }

    // DOM node builder for the given v node
    const nsURI = ns || (v.props && v.props.xmlns);

    // Corresponding DOM node, if any. Reuse if tag and text matches. Insert
    // new DOM node before otherwise.
    let node = dom.childNodes[i] as any;
    if (!node || (v.element ? node.e !== v.element : node.data !== v)) {
      node = dom.insertBefore(createNode(), node) as any;
    }
    if (v.element && !v?.props?.dangerouslySetInnerHTML) {
      node.e = v.element;
      for (const propName of Object.keys(v.props)) {
        if (node[propName] !== v.props[propName]) {
          if (nsURI) {
            node.setAttribute(propName, v.props[propName]);
          } else {
            node[propName] = v.props[propName];
          }
        }
      }
      if (v.children && v.children.length > 0) {
        render(v.children as any, node, nsURI);
      }
    } else {
      node.data = v;
    }
  }
  // Iterate over all hooks, if a hook has a useEffect callback set - call it
  // (since the rendering is now done) and remove.
  Object.values(dom.h).forEach((componentHooks) =>
    componentHooks.forEach(
      (h) => h.cb && ((h.cleanup = h.cb()), (h.cb = undefined)),
    ),
  );
  // For all hooks present in the DOM node before rendering, but not present
  // after - call the cleanup callbacks, if any. This means the corresponding
  // nodes have been removed from DOM and cleanup should happen. Beware, that
  // the order is unfortunately not guaranteed, to keep the implementation
  // simple.
  Object.keys(hs)
    // @ts-ignore
    .filter((k) => !dom.h[k])
    .forEach((k) => hs[k].forEach((h) => h.cleanup && h.cleanup()));
  for (let child; (child = dom.childNodes[nodeList.length]); ) {
    render([], dom.removeChild(child) as any);
  }
};
