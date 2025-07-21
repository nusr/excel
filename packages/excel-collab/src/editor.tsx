import {
  ExcelEditor,
  EditorProps,
  StateContext,
  StateContextValue,
} from './containers';
import { memo, useEffect, useState } from 'react';
import { initController } from './controller';
import Worker from './worker?worker';
import { Doc } from 'yjs';

export type DocConfig = ConstructorParameters<typeof Doc>[0];

export type ExcelProps = EditorProps & {
  doc?: Doc;
  docConfig?: DocConfig;
} & Pick<StateContextValue, 'provider' | 'awareness'>;

export const Excel: React.FunctionComponent<ExcelProps> = memo((props) => {
  const { doc, provider, awareness, docConfig } = props;

  const [value, setValue] = useState<StateContextValue | undefined>(undefined);

  useEffect(() => {
    const controller = initController({
      worker: new Worker(),
      doc: doc ? doc : docConfig ? new Doc(docConfig) : new Doc(),
    });

    setValue({ controller, provider, awareness });
  }, []);

  return (
    <StateContext.Provider value={value}>
      {value && <ExcelEditor {...props} />}
    </StateContext.Provider>
  );
});

Excel.displayName = 'Excel';
