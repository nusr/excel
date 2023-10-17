import { FormulaBarContainer } from '../FormulaBar';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { initController } from '@/controller';
describe('FormulaBarContainer.test.ts', () => {
    afterEach(cleanup);
    test('normal', () => {
        render(React.createElement(FormulaBarContainer, { controller: initController() }));
        expect(screen.getByTestId('formula-bar-name').textContent).toEqual('A1');
        expect(screen.getByTestId('formula-bar').childNodes).toHaveLength(2);
    });
});
//# sourceMappingURL=FormulaBar.test.js.map