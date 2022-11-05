import {
  h,
  render,
  Component,
  useState,
  useReducer,
  Reducer,
  useEffect,
} from '../react';
describe('hooks', () => {
  test('useState', () => {
    const Counter: Component = () => {
      const [n, setN] = useState(0);
      return h(
        'div',
        {},
        h('div', { className: 'count' }, `Count: ${n}`),
        h(
          'button',
          {
            onclick: () => setN(n + 1),
          },
          'Add',
        ),
      );
    };
    Counter.displayName = 'Counter';
    document.body.innerHTML = ''; // clear all the previous hooks
    render(h(Counter, {}), document.body);
    expect(document.querySelector('.count')!.textContent).toEqual('Count: 0');
    // @ts-ignore
    document.querySelector('button').onclick();
    expect(document.querySelector('.count')!.textContent).toEqual('Count: 1');
    // @ts-ignore
    document.querySelector('button').onclick();
    expect(document.querySelector('.count')!.textContent).toEqual('Count: 2');
  });
  test('useReducer', () => {
    const reducer: Reducer<number, string> = (state, action) => {
      switch (action) {
        case 'incr':
          return state + 1;
        case 'decr':
          return state - 1;
      }
      return state;
    };
    const Counter: Component = () => {
      const [n, dispatch] = useReducer(reducer, 0);
      return h(
        'div',
        {},
        h('div', { className: 'count' }, `Count: ${n}`),
        h(
          'button',
          {
            onclick: () => dispatch('incr'),
          },
          'Add',
        ),
      );
    };
    Counter.displayName = 'Counter';
    document.body.innerHTML = ''; // clear all the previous hooks
    render(h(Counter, {}), document.body);
    expect(document.querySelector('.count')!.textContent).toEqual('Count: 0');
    // @ts-ignore
    document.querySelector('button').onclick();
    expect(document.querySelector('.count')!.textContent).toEqual('Count: 1');
    // @ts-ignore
    document.querySelector('button').onclick();
    expect(document.querySelector('.count')!.textContent).toEqual('Count: 2');
  });
  test('useEffect', () => {
    let called = 0;
    let cleanup = 0;
    const Title: Component<{ title: string }> = ({ title }) => {
      let afterRender = 0;
      useEffect(() => {
        expect(afterRender).toEqual(1);
        expect(document.querySelector('h1')!.textContent).toEqual(title);
        called++;
        document.title = title;
        return () => {
          cleanup++;
        };
      }, [title]);
      afterRender = 1;
      return h('h1', {}, title);
    };
    Title.displayName = 'Title';
    document.body.innerHTML = '';
    // Render and ensure that useEffect is called only when title is changed
    render(h(Title, { title: 'foo' }), document.body);
    expect(called).toEqual(1);
    expect(document.querySelector('h1')!.textContent).toEqual('foo');
    render(h(Title, { title: 'foo' }), document.body);
    expect(called).toEqual(1);
    expect(document.querySelector('h1')!.textContent).toEqual('foo');
    render(h(Title, { title: 'bar' }), document.body);
    expect(called).toEqual(2);
    expect(document.querySelector('h1')!.textContent).toEqual('bar');
    // Un-mount and ensure that cleanup callback is called
    render([], document.body);
    expect(called).toEqual(2);
    expect(cleanup).toEqual(1);
    // Mount again and ensure that useEffect is called once more
    render(h(Title, { title: 'bar' }), document.body);
    expect(called).toEqual(3);
    expect(cleanup).toEqual(1);
    // Un-mount and ensure that cleanup callback is called once more
    render([], document.body);
    expect(called).toEqual(3);
    expect(cleanup).toEqual(2);
  });
  // test('reorder id', () => {
  //   type Props = {
  //     id: string;
  //     key: string;
  //   };
  //   const C: Component<Props> = ({ id, key }) => {
  //     const [n, setN] = useState(0);
  //     return h(
  //       'div',
  //       {
  //         id,
  //         key,
  //       },
  //       h('div', { className: 'count' }, `Count: ${n}`),
  //       h(
  //         'button',
  //         {
  //           onclick: () => setN(n + 1),
  //         },
  //         'Add',
  //       ),
  //     );
  //   };
  //   C.displayName = 'Counter';

  //   const A: Component = () =>
  //     h(
  //       'div',
  //       h<Props>(C, { id: 'c1', key: 'c1' }),
  //       h<Props>(C, { id: 'c2', key: 'c2' }),
  //       h('br', {}),
  //     );
  //   A.displayName = 'A';
  //   const B: Component = () =>
  //     h(
  //       'div',
  //       {},
  //       h('br', {}),
  //       h<Props>(C, { id: 'c3', key: 'c2' }),
  //       h<Props>(C, {
  //         id: 'c4',
  //         key: 'c1',
  //       }),
  //     );
  //   B.displayName = 'B';
  //   document.body.innerHTML = ''; // clear all the previous hooks
  //   render(h(A, {}), document.body);
  //   // @ts-ignore
  //   document.querySelector('#c1 button')!.onclick();
  //   // @ts-ignore
  //   document.querySelector('#c2 button')!.onclick();
  //   // @ts-ignore
  //   document.querySelector('#c2 button')!.onclick();
  //   expect(document.querySelector('#c1 .count')!.textContent).toEqual(
  //     'Count: 1',
  //   );
  //   expect(document.querySelector('#c2 .count')!.textContent).toEqual(
  //     'Count: 2',
  //   );
  //   render(h(B, {}), document.body);
  //   expect(document.querySelector('#c3 .count')!.textContent).toEqual(
  //     'Count: 2',
  //   );
  //   expect(document.querySelector('#c4 .count')!.textContent).toEqual(
  //     'Count: 1',
  //   );
  // });
});
