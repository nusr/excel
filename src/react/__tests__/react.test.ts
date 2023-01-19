import { render, h, FunctionComponent } from '..';

describe('react.test.ts', () => {
  describe('h', () => {
    test('normal', () => {
      expect(h('div', {})).toEqual({
        sel: 'div',
        data: {},
        children: [],
        elm: undefined,
        key: undefined,
        text: undefined,
      });
      expect(h('div', {}, 'hello')).toEqual({
        sel: 'div',
        data: {},
        children: [],
        elm: undefined,
        key: undefined,
        text: 'hello',
      });
      expect(h('div', { className: '1' }, 'hello')).toEqual({
        sel: 'div',
        data: { className: '1' },
        children: [],
        elm: undefined,
        key: undefined,
        text: 'hello',
      });
    });
  });
  describe('render', () => {
    test('single stateless node', () => {
      render(document.body, h('div', { className: 'simple' }, 'text'));
      expect(document.querySelector('.simple')!.textContent).toEqual('text');
    });
    test('single stateless component', () => {
      const Hello: FunctionComponent = () =>
        h('div', { className: 'component' }, 'Hello');
      Hello.displayName = 'Hello';
      render(document.body, Hello({}));
      expect(document.querySelector('.component')!.textContent).toEqual(
        'Hello',
      );
    });
    test('component with properties', () => {
      const Text: FunctionComponent<{ cls: string; text: string }> = ({
        cls,
        text,
      }) => h('p', { className: cls }, text);
      Text.displayName = 'Text';
      render(document.body, Text({ cls: 'foo', text: 'bar' }));
      expect(document.querySelector('.foo')!.textContent).toEqual('bar');
    });
    test('component with children', () => {
      const A: FunctionComponent = () => h('div', { className: 'a' }, 'A');
      A.displayName = 'A';
      const B: FunctionComponent = () => h('div', { className: 'b' }, 'B');
      B.displayName = 'B';
      const C: FunctionComponent = (_, ...children) =>
        h('div', { className: 'c' }, ...children);
      C.displayName = 'C';
      const D: FunctionComponent = () => C({}, C({}, A({}), B({})));
      D.displayName = 'D';
      render(document.body, D({}));
      expect(document.querySelector('.c > .c > .a')!.textContent).toEqual('A');
      expect(document.querySelector('.c > .c > .b')!.textContent).toEqual('B');
    });
  });
  describe('ref hook', () => {
    test('normal', () => {
      let dom: Element | null = null;
      render(
        document.body,
        h(
          'div',
          {
            className: 'simple',
            hook: {
              ref(e) {
                dom = e;
              },
            },
          },
          'text',
        ),
      );
      expect(document.querySelector('.simple')!).toEqual(dom);
    });
  });
});
