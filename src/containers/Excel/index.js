import React, { Fragment, useRef } from 'react';
import { Button } from '../components';
import { importXLSX } from './import';
import { exportToXLSX } from './export';
const buttonStyle = { minWidth: 80 };
export const Import = ({ controller }) => {
    const ref = useRef(null);
    const handleChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        const model = await importXLSX(file);
        controller.fromJSON(model);
        ref.current.value = '';
        ref.current.blur();
    };
    return (React.createElement(Fragment, null,
        React.createElement("input", { type: "file", ref: ref, style: { display: 'none' }, onChange: handleChange, accept: ".xlsx" }),
        React.createElement(Button, { testId: "toolbar-import-xlsx", onClick: () => {
                ref.current.click();
            }, style: buttonStyle }, "import XLSX")));
};
export const Export = ({ controller }) => {
    const handleExport = () => {
        exportToXLSX('test.xlsx', controller);
    };
    return (React.createElement(Fragment, null,
        React.createElement(Button, { testId: "toolbar-export-xlsx", onClick: handleExport, style: buttonStyle }, "Export XLSX")));
};
//# sourceMappingURL=index.js.map