import React, { Fragment, useRef } from 'react';
import { Button } from '../components';
import { parseXLSX } from './import';
export const Import = ({ controller }) => {
    const ref = useRef(null);
    const handleChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        const model = await parseXLSX(file);
        controller.fromJSON(model);
        ref.current.value = '';
        ref.current.blur();
    };
    return (React.createElement(Fragment, null,
        React.createElement("input", { type: "file", ref: ref, style: { display: 'none' }, onChange: handleChange, accept: ".xlsx" }),
        React.createElement(Button, { testId: "toolbar-import-xlsx", onClick: () => {
                ref.current.click();
            }, style: { minWidth: 80 } }, "import XLSX")));
};
//# sourceMappingURL=index.js.map