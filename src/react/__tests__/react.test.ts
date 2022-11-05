import { h, render, Component } from '../react';

describe('react.test.ts', () => {
  describe('h', () => {
    test('normal', () => {
      expect(h('div', {})).toEqual({ element: 'div', props: {}, children: [] });
      expect(h('div', {}, 'hello')).toEqual({
        element: 'div',
        props: {},
        children: ['hello'],
      });
      expect(h('div', { a: 1 }, 'hello')).toEqual({
        element: 'div',
        props: { a: 1 },
        children: ['hello'],
      });
    });
  });
  describe('render', () => {
    test('single stateless node', () => {
      render(h('div', { className: 'simple' }, 'text'), document.body);
      expect(document.querySelector('.simple')!.textContent).toEqual('text');
    });
    test('single stateless component', () => {
      const Hello: Component = () =>
        h('div', { className: 'component' }, 'Hello');
      Hello.displayName = 'Hello';
      render(h(Hello, {}), document.body);
      expect(document.querySelector('.component')!.textContent).toEqual(
        'Hello',
      );
    });
    test('component with properties', () => {
      const Text: Component<{ cls: string; text: string }> = ({ cls, text }) =>
        h('p', { className: cls }, text);
      Text.displayName = 'Text';
      render(h(Text, { cls: 'foo', text: 'bar' }), document.body);
      expect(document.querySelector('.foo')!.textContent).toEqual('bar');
    });
    test('component with children', () => {
      const A: Component = () => h('div', { className: 'a' }, 'A');
      A.displayName = 'A';
      const B: Component = () => h('div', { className: 'b' }, 'B');
      B.displayName = 'B';
      const C: Component = (_, children) =>
        h('div', { className: 'c' }, ...children);
      C.displayName = 'C';
      const D: Component = () => h(C, {}, h(C, {}, h(A, {}), h(B, {})));
      D.displayName = 'D';
      render(h(D, {}), document.body);
      expect(document.querySelector('.c > .c > .a')!.textContent).toEqual('A');
      expect(document.querySelector('.c > .c > .b')!.textContent).toEqual('B');
    });
  });
  describe('forceUpdate', () => {
    test('click counter', () => {
      let count = 0;
      const Counter: Component = (_, __, forceUpdate) => {
        const handleClick = () => {
          count++;
          forceUpdate();
        };
        return h(
          'div',
          {},
          h(
            'div',
            {
              className: 'count',
            },
            `Count: ${count}`,
          ),
          h(
            'button',
            {
              onclick: handleClick,
            },
            'Add',
          ),
        );
      };
      Counter.displayName = 'Counter';
      render(h(Counter, {}), document.body);
      expect(document.querySelector('.count')!.textContent).toEqual('Count: 0');
      // @ts-ignore
      document.querySelector<HTMLButtonElement>('button')!.onclick();
      expect(document.querySelector('.count')!.textContent).toEqual('Count: 1');
      // @ts-ignore
      document!.querySelector('button')!.onclick();
      expect(document.querySelector('.count')!.textContent).toEqual('Count: 2');
    });
  });
});
