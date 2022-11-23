import { reactLog } from '@/util';

export interface DOMOperation {
  createElement: (
    tagName: any,
    options?: ElementCreationOptions,
  ) => HTMLElement;
  createElementNS: (
    namespaceURI: string,
    qualifiedName: string,
    options?: ElementCreationOptions,
  ) => Element;
  createTextNode: (text: string) => Text;
  insertBefore: (
    parentNode: Node,
    newNode: Node,
    referenceNode: Node | null,
  ) => void;
  removeChild: (node: Node, child: Node) => void;
  appendChild: (node: Node, child: Node) => void;
  parentNode: (node: Node) => Node | null;
  nextSibling: (node: Node) => Node | null;
  setTextContent: (node: Node, text: string | null) => void;
  isElement: (node: Node) => node is Element;
}

function createElement(
  tagName: any,
  options?: ElementCreationOptions,
): HTMLElement {
  reactLog('createElement');
  return document.createElement(tagName, options);
}

function createElementNS(
  namespaceURI: string,
  qualifiedName: string,
  options?: ElementCreationOptions,
): Element {
  reactLog('createElementNS');
  return document.createElementNS(namespaceURI, qualifiedName, options);
}

function createTextNode(text: string): Text {
  reactLog('createTextNode');
  return document.createTextNode(text);
}

function insertBefore(
  parentNode: Node,
  newNode: Node,
  referenceNode: Node | null,
): void {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild(node: Node, child: Node): void {
  node.removeChild(child);
}

function appendChild(node: Node, child: Node): void {
  node.appendChild(child);
}

function parentNode(node: Node): Node | null {
  return node.parentNode;
}

function nextSibling(node: Node): Node | null {
  return node.nextSibling;
}

function setTextContent(node: Node, text: string | null): void {
  node.textContent = text;
}

function isElement(node: Node): node is Element {
  return node.nodeType === 1;
}

export const htmlDomApi: DOMOperation = {
  createElement,
  createElementNS,
  createTextNode,
  insertBefore,
  removeChild,
  appendChild,
  parentNode,
  nextSibling,
  setTextContent,
  isElement,
};
