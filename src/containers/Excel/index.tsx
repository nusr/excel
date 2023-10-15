import React, { Fragment, useRef } from 'react';
import type { IController } from '@/types';
import { Button } from '../components';
import { parseXLSX } from './util';

type Props = {
  controller: IController;
};

export const Import: React.FunctionComponent<Props> = ({ controller }) => {
  const ref = useRef<HTMLInputElement>(null);
  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const model = await parseXLSX(file);
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
        style={{ minWidth: 80 }}
      >
        import XLSX
      </Button>
    </Fragment>
  );
};
