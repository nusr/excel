import React, { Fragment, useRef } from 'react';
import type { IController } from '@/types';
import { Button } from '../components';
import { importXLSX } from './import';
import { exportToXLSX } from './export';

type Props = {
  controller: IController;
};

const buttonStyle = { minWidth: 80 };

export const Import: React.FunctionComponent<Props> = ({ controller }) => {
  const ref = useRef<HTMLInputElement>(null);
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const model = await importXLSX(file);
    controller.fromJSON(model);
    ref.current!.value = '';
    ref.current!.blur();
  };
  return (
    <Fragment>
      <input
        type="file"
        ref={ref}
        style={{ display: 'none' }}
        onChange={handleChange}
        accept=".xlsx"
      />
      <Button
        testId="toolbar-import-xlsx"
        onClick={() => {
          ref.current!.click();
        }}
        style={buttonStyle}
      >
        import XLSX
      </Button>
    </Fragment>
  );
};

export const Export: React.FunctionComponent<Props> = ({ controller }) => {
  const handleExport = () => {
    exportToXLSX('test.xlsx', controller);
  };
  return (
    <Fragment>
      <Button
        testId="toolbar-export-xlsx"
        onClick={handleExport}
        style={buttonStyle}
      >
        Export XLSX
      </Button>
    </Fragment>
  );
};
