import React, { Fragment, useRef } from 'react';
import type { IController } from '@/types';
import { Button } from '../components';
import { importXLSX } from './import';
import { exportToXLSX, exportToCsv } from './export';

interface Props {
  controller: IController;
}

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
      <input type="file" ref={ref} style={{ display: 'none' }} onChange={handleChange} accept=".xlsx" />
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
  const handleExportXLSX = () => {
    exportToXLSX(`excel_${Date.now()}.xlsx`, controller);
  };
  const handleExportCSV = () => {
    exportToCsv(`excel_${Date.now()}.csv`, controller);
  };
  return (
    <Fragment>
      <Button testId="toolbar-export-xlsx" onClick={handleExportXLSX} style={buttonStyle}>
        Export XLSX
      </Button>
      <Button testId="toolbar-export-csv" onClick={handleExportCSV} style={buttonStyle}>
        Export CSV
      </Button>
    </Fragment>
  );
};
