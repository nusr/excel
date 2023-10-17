import { CanvasContainer } from '../canvas';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { initController } from '@/controller';
describe('CanvasContainer.test.ts', () => {
    afterEach(cleanup);
    test('normal', () => {
        render(React.createElement(CanvasContainer, { controller: initController() }));
        expect(screen.getByTestId('canvas-container').childNodes).toHaveLength(3);
        expect(screen.getByTestId('canvas-container').firstChild.nodeName).toEqual('CANVAS');
    });
    test('context menu', () => {
        const controller = initController();
        render(React.createElement(CanvasContainer, { controller: controller }));
        fireEvent.contextMenu(screen.getByTestId('canvas-main'), {
            clientY: 4000,
            clientX: 4000,
        });
        expect(screen.getByTestId('context-menu').childNodes).toHaveLength(7);
    });
});
//# sourceMappingURL=Canvas.test.js.map