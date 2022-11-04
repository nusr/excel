// import jsdom from 'jsdom';

import { h, x, render, Component } from '../react';

// Global document mock
// global.document = new jsdom.JSDOM(`<html><body></body></html>`).window.document;

describe('index.test.ts', () => {
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
  describe('x', () => {
    test('empty', () => {
      expect(x``).toEqual(undefined);
    });
    test('text', () => {
      expect(x`hello`).toEqual('hello');
    });
    test('normal tag', () => {
      expect(x`<div></div>`).toEqual(h('div', {}));
    });
    test('self-closing tag', () => {
      expect(x`<br />`).toEqual(h('br', {}));
    });
    test('attrs', () => {
      expect(x`<div a="b" c="d e" />`).toEqual(h('div', { a: 'b', c: 'd e' }));
    });
    test('tag with text', () => {
      expect(x`<p>Hello</p>`).toEqual(h('p', {}, 'Hello'));
    });
    test('nested tags', () => {
      expect(x`<p><i>Hello</i></p>`).toEqual(h('p', {}, h('i', {}, 'Hello')));
    });
    test('x: ${text}', () => {
      expect(x`<p>hello, ${'world'}</p>`).toEqual(
        h('p', {}, 'hello, ', 'world'),
      );
      expect(x`<p>hello, ${'world'}!</p>`).toEqual(
        h('p', {}, 'hello, ', 'world', '!'),
      );
      expect(x`<p>${'world'}, hello!</p>`).toEqual(
        h('p', {}, 'world', ', hello!'),
      );
    });
    test('x: ${tag}', () => {
      expect(x`<${'p'}>hello</${'p'}>`).toEqual(h('p', {}, 'hello'));
      expect(x`<${'br'} />`).toEqual(h('br', {}));
    });
    test('x: ${attr}', () => {
      expect(x`<p a=${'b'} c=${'d'}/>`).toEqual(h('p', { a: 'b', c: 'd' }));
    });
  });
  describe('render', () => {
    test('single stateless node', () => {
      render(x`<div className="simple">text</div>`, document.body);
      expect(document.querySelector('.simple')!.textContent).toEqual('text');
    });
    test('single stateless component', () => {
      const Hello = () => x`<div className="component">Hello</div>`;
      render(h(Hello, {}), document.body);
      expect(document.querySelector('.component')!.textContent).toEqual(
        'Hello',
      );
    });
    test('component with properties', () => {
      const Text: Component = ({ cls, text }) =>
        x`<p className=${cls}>${text}</p>`;
      render(h(Text, { cls: 'foo', text: 'bar' }), document.body);
      expect(document.querySelector('.foo')!.textContent).toEqual('bar');
    });
    test('component with children', () => {
      const A = () => x`<div className="a">A</div>`;
      const B = () => x`<div className="b">B</div>`;
      const C: Component = (props, children) =>
        x`<div className="c">${children}</div>`;
      const D = () => x`<${C}><${C}><${A} /><${B} /></${C}></${C}>`;
      render(h(D, {}), document.body);
      expect(document.querySelector('.c > .c > .a')!.textContent).toEqual('A');
      expect(document.querySelector('.c > .c > .b')!.textContent).toEqual('B');
    });
  });
  describe('forceUpdate', () => {
    test('click counter', () => {
      let count = 0;
      const Counter: Component = (props, children, forceUpdate) => {
        const handleClick = () => {
          count++;
          forceUpdate();
        };
        return x`
              <div>
                <div className="count">Count: ${count}</div>
                <button onclick=${handleClick}>Add</button>
              </div>
            `;
      };
      render(h(Counter, {}), document.body);
      expect(document.querySelector('.count')!.textContent).toEqual('Count: 0');
      // document!.querySelector('button')!.onclick();
      // expect(document.querySelector('.count')!.textContent).toEqual('Count: 1');
      // document!.querySelector('button')!.onclick();
      // expect(document.querySelector('.count')!.textContent).toEqual('Count: 2');
    });
  });
});

// // ---------------------------------------------------------------------------
// // forceUpdate()
// // ---------------------------------------------------------------------------
// $['forceUpdate: click counter'] = () => {

// };

// // ---------------------------------------------------------------------------
// // Hooks
// // ---------------------------------------------------------------------------
// $['hooks: useState'] = () => {
//     const Counter = () => {
//         const [n, setN] = useState(0);
//         return x`
//       <div>
//         <div className="count">Count: ${n}</div>
//         <button onclick=${() => setN(n + 1)}>Add</button>
//       </div>
//     `;
//     };
//     document.body.innerHTML = ''; // clear all the previous hooks
//     render(h(Counter), document.body);
//     expect(document.querySelector('.count').textContent, 'Count: 0');
//     document.querySelector('button').onclick();
//     expect(document.querySelector('.count').textContent, 'Count: 1');
//     document.querySelector('button').onclick();
//     expect(document.querySelector('.count').textContent, 'Count: 2');
// };

// $['hooks: useReducer'] = () => {
//     const reducer = (state, action) => {
//         switch (action) {
//             case 'incr':
//                 return state + 1;
//             case 'decr':
//                 return state - 1;
//         }
//         return state;
//     };
//     const Counter = () => {
//         const [n, dispatch] = useReducer(reducer, 0);
//         return x`
//       <div>
//         <div className="count">Count: ${n}</div>
//         <button onclick=${() => dispatch('incr')}>Add</button>
//       </div>
//     `;
//     };
//     document.body.innerHTML = ''; // clear all the previous hooks
//     render(h(Counter), document.body);
//     expect(document.querySelector('.count').textContent, 'Count: 0');
//     document.querySelector('button').onclick();
//     expect(document.querySelector('.count').textContent, 'Count: 1');
//     document.querySelector('button').onclick();
//     expect(document.querySelector('.count').textContent, 'Count: 2');
// };

// $['hooks: reorder with id'] = () => {
//     const C = ({ id }) => {
//         const [n, setN] = useState(0);
//         return x`
//       <div id=${id}>
//         <div className="count">Count: ${n}</div>
//         <button onclick=${() => setN(n + 1)}>Add</button>
//       </div>
//     `;
//     };
//     const A = () =>
//         x`<div><${C} id="c1" k="c1"/><${C} id="c2" k="c2"/><br/></div>`;
//     const B = () =>
//         x`<div><br/><${C} id="c3" k="c2"/><${C} id="c4" k="c1"/></div>`;
//     document.body.innerHTML = ''; // clear all the previous hooks
//     render(h(A), document.body);
//     document.querySelector('#c1 button').onclick();
//     document.querySelector('#c2 button').onclick();
//     document.querySelector('#c2 button').onclick();
//     expect(document.querySelector('#c1 .count').textContent, 'Count: 1');
//     expect(document.querySelector('#c2 .count').textContent, 'Count: 2');
//     render(h(B), document.body);
//     expect(document.querySelector('#c3 .count').textContent, 'Count: 2');
//     expect(document.querySelector('#c4 .count').textContent, 'Count: 1');
// };

// $['hooks: useEffect'] = () => {
//     let called = 0;
//     let cleanup = 0;
//     const Title = ({ title }) => {
//         let afterRender = 0;
//         useEffect(() => {
//             expect(afterRender, 1);
//             expect(document.querySelector('h1').textContent, title);
//             called++;
//             document.title = title;
//             return () => {
//                 cleanup++;
//             };
//         }, [title]);
//         afterRender = 1;
//         return x`<h1>${title}</h1>`;
//     };
//     document.body.innerHTML = '';
//     // Render and ensure that useEffect is called only when title is changed
//     render(h(Title, { title: 'foo' }), document.body);
//     expect(called, 1);
//     expect(document.querySelector('h1').textContent, 'foo');
//     render(h(Title, { title: 'foo' }), document.body);
//     expect(called, 1);
//     expect(document.querySelector('h1').textContent, 'foo');
//     render(h(Title, { title: 'bar' }), document.body);
//     expect(called, 2);
//     expect(document.querySelector('h1').textContent, 'bar');
//     // Un-mount and ensure that cleanup callback is called
//     render([], document.body);
//     expect(called, 2);
//     expect(cleanup, 1);
//     // Mount again and ensure that useEffect is called once more
//     render(h(Title, { title: 'bar' }), document.body);
//     expect(called, 3);
//     expect(cleanup, 1);
//     // Un-mount and ensure that cleanup callback is called once more
//     render([], document.body);
//     expect(called, 3);
//     expect(cleanup, 2);
// };

// // ---------------------------------------------------------------------------
// // ---------------------------------------------------------------------------
// // ---------------------------------------------------------------------------

// // Try running "+" tests only, otherwise run all tests, skipping "-" tests.
// if (
//     Object.keys($)
//         .filter(t => t.startsWith('+'))
//         .map(t => $[t]()).length == 0
// ) {
//     for (let t in $) {
//         if (t.startsWith('-')) {
//             console.log('SKIP:', t);
//         } else {
//             console.log('TEST:', t);
//             $[t]();
//         }
//     }
// }
