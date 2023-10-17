import { Button } from '../Button';
import { cleanup, render } from '@testing-library/react';
import React from 'react';
describe('Button.test.ts', () => {
    afterEach(cleanup);
    test('normal', () => {
        const dom = render(React.createElement(Button, { active: true, className: "button_test" }, "button"));
        expect(dom.container.textContent).toEqual('button');
    });
    test('icon button', () => {
        const dom = render(React.createElement(Button, { active: true, className: "icon_button", type: "circle" }, "add"));
        expect(dom.container.textContent).toEqual('add');
        expect(dom.container.childNodes).toHaveLength(1);
    });
});
//# sourceMappingURL=Button.test.js.map