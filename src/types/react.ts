import { StoreValue } from "./components";
import { IController } from "./controller";

export type ReactElement = VNode | string | null | undefined | number;
export type KeyType = string | number;
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
export interface VNode {
  tag: string;
  props: Record<string, any>;
  children: VNode[];
  type?: number;
  node?: DomType;
}

export interface Component<T = {}> {
  (props: T, ...children: Array<VNode | string | number>): VNode;
  displayName: string;
}

export interface SmartComponent {
  (props: StoreValue, controller: IController): VNode;
  displayName: string;
}

export type DomType = HTMLElement & {
  vdom?: VNode;
  events?: Record<string, any>;
  value?: any;
  selected?: boolean;
  checked?: boolean;
};
