import { h, render, Component, text as TextNode } from '../react';
import { JSDOM } from "jsdom"
global.document = new JSDOM(`<div id="app"></div>`).window.document

describe('react.test.ts', () => {
  describe('h', () => {
    test('normal', () => {
      expect(h('div', {})).toEqual({ element: 'div', props: {}, children: [] });
      expect(h('div', {}, TextNode('hello'))).toEqual({
        element: 'div',
        props: {},
        children: ['hello'],
      });
      expect(h('div', { a: 1 }, TextNode('hello'))).toEqual({
        element: 'div',
        props: { a: 1 },
        children: ['hello'],
      });
    });
  });
  describe('render', () => {
    test('single stateless node', () => {
      render(
        document.getElementById("app")!,
        h('div', { className: 'simple' }, TextNode('text')),
      );
      expect(document.querySelector('.simple')!.textContent).toEqual('text');
    });
    test('single stateless component', () => {
      const Hello: Component = () =>
        h('div', { className: 'component' }, TextNode('Hello'));
      Hello.displayName = 'Hello';
      render(document.getElementById("app")!, Hello({}));
      expect(document.querySelector('.component')!.textContent).toEqual(
        'Hello',
      );
    });
    test('component with properties', () => {
      const Text: Component<{ cls: string; text: string }> = ({ cls, text }) =>
        h('p', { className: cls }, TextNode(text));
      Text.displayName = 'Text';
      render(document.getElementById("app")!, Text({ cls: 'foo', text: 'bar' }));
      expect(document.querySelector('.foo')!.textContent).toEqual('bar');
    });
    test('component with children', () => {
      const A: Component = () => h('div', { className: 'a' }, TextNode('A'));
      A.displayName = 'A';
      const B: Component = () => h('div', { className: 'b' }, TextNode('B'));
      B.displayName = 'B';
      const C: Component = (_, ...children) =>
        h('div', { className: 'c' }, ...children);
      C.displayName = 'C';
      const D: Component = () => C({}, C({}, A({}), B({})));
      D.displayName = 'D';
      render(document.getElementById("app")!, D({}));
      expect(document.querySelector('.c > .c > .a')!.textContent).toEqual('A');
      expect(document.querySelector('.c > .c > .b')!.textContent).toEqual('B');
    });
  });
});
