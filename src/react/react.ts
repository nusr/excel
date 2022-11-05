export type ForceUpdateType = () => void;
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
type MountType = (forceUpdate: ForceUpdateType) => void;
export interface Component<T = PropsType> {
  (
    props: T & PropsType,
    children: ChildrenType,
    forceUpdate: ForceUpdateType,
  ): ReactElement;
  displayName: string;
  onceMount?: MountType;
}
type ElementType = string | Component<any>;
interface HooksType {
  value: any;
  cb?: () => ForceUpdateType | void;
  cleanup?: ForceUpdateType | void;
}

interface VNode<T = PropsType> {
  element: ElementType;
  props: T;
  children: ChildrenType;
}

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

export function h<T extends PropsType>(
  element: ElementType,
  props: T,
  ...children: ChildrenType
): VNode {
  if (props.dangerouslySetInnerHTML) {
    props.dangerouslySetInnerHTML = props.dangerouslySetInnerHTML.trim();
  }
  return { element, props, children };
}

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

export const useOnceMount = (cb: HooksType['cb']) => {
  const hook = getHook(undefined);
  hook.cb = cb;
};

const changed = (a: any[], b: any[]) =>
  !a || a.length !== b.length || b.some((arg, i) => arg !== a[i]);

export const render = (
  list: ReactElement | Array<ReactElement>,
  dom: Element & { h?: Record<string, HooksType[]> },
  ns: string = '',
) => {
  // Make vlist always an array, even if it's a single node.
  const realList: Array<ReactElement> = Array.isArray(list) ? list : [list];
  const nodeList: any[] = realList
    .filter((v) => {
      if (v === null) {
        return false;
      }
      if (v === undefined) {
        return false;
      }
      if (v === '') {
        return false;
      }
      return true;
    })
    .map((item) => {
      if (typeof item === 'number') {
        return String(item);
      }
      return item;
    }) as Array<string | VNode>;
  // Unique implicit keys counter for un-keyed nodes
  const ids = new Map<any, number>();
  // Current hooks storage
  const hs: Record<string, HooksType[]> = dom.h || {};
  // Erase hooks storage
  dom.h = {};
  const mountList: Array<{
    onceMount: MountType;
    forceUpdate: ForceUpdateType;
  }> = [];
  for (let i = 0; i < nodeList.length; i++) {
    let v = nodeList[i];
    forceUpdate = () => render(nodeList, dom);
    // Current component re-rendering function (global, used by some hooks).
    while (v.element && typeof v.element === 'function') {
      if (v.element.onceMount) {
        mountList.push({
          onceMount: v.element.onceMount,
          forceUpdate,
        });
        v.element.onceMount = undefined;
      }
      // Key, explicit v property or implicit auto-incremented key
      const oldKey = ids.get(v.element) || 1;
      const k = (v.props && v.props.key) || '' + v.element + (oldKey + 1);
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
    const createNode = () => {
      if (typeof v === 'string') {
        return document.createTextNode(v);
      }
      if (v?.props?.dangerouslySetInnerHTML?.trim()) {
        const template = document.createElement('span');
        template.innerHTML = v?.props?.dangerouslySetInnerHTML;
        return template.childNodes[0];
      }
      if (nsURI) {
        return document.createElementNS(nsURI, v.element as string);
      } else {
        return document.createElement(v.element as string);
      }
    };
    const isRenderHtml = !!v?.props?.dangerouslySetInnerHTML;
    // Corresponding DOM node, if any. Reuse if tag and text matches. Insert
    // new DOM node before otherwise.
    let node = dom.childNodes[i] as any;

    if (!node || (v.element ? node.e !== v.element : node.data !== v)) {
      node = dom.insertBefore(createNode(), node) as any;
    }
    if (v.element && !isRenderHtml) {
      node.e = v.element;
      for (const propName of Object.keys(v.props)) {
        if (node[propName] !== v.props[propName]) {
          if (!v.props[propName]) {
            continue;
          }
          const key = propName;
          if (nsURI) {
            node.setAttribute(key, v.props[key]);
          } else {
            node[key] = v.props[key];
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
  Object.values(dom.h).forEach((componentHooks) => {
    componentHooks.forEach((h) => {
      if (h.cb) {
        h.cleanup = h.cb();
        h.cb = undefined;
      }
    });
  });

  // For all hooks present in the DOM node before rendering, but not present
  // after - call the cleanup callbacks, if any. This means the corresponding
  // nodes have been removed from DOM and cleanup should happen. Beware, that
  // the order is unfortunately not guaranteed, to keep the implementation
  // simple.
  Object.keys(hs)
    // @ts-ignore
    .filter((k) => !dom.h[k])
    .forEach((k) =>
      hs[k].forEach((h) => {
        if (h.cleanup) {
          h.cleanup();
        }
      }),
    );

  for (const item of mountList) {
    item.onceMount(item.forceUpdate);
  }
  for (let child; (child = dom.childNodes[nodeList.length]); ) {
    render([], dom.removeChild(child) as any);
  }
};
