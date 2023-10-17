import { App } from '@/containers';
import { initController } from '@/controller';
import * as React from 'react';
import { cleanup, render } from '@testing-library/react';
describe('App.test.ts', () => {
    afterEach(cleanup);
    test('normal', () => {
        const controller = initController();
        const component = render(React.createElement(App, { controller: controller }));
        expect(component.container.firstChild.childNodes).toHaveLength(4);
    });
});
//# sourceMappingURL=App.test.js.map