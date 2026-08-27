import {
  ExcelEditor,
  EditorProps,
  StateContext,
  StateContextValue,
} from './containers';
import { memo, useEffect, useState } from 'react';
import { initController } from './controller';
import Worker from './worker?worker&inline';
import { Doc } from 'yjs';
import i18n from './i18n';
import { RTL_LANGUAGE_LIST } from './util/constant';

export type DocConfig = ConstructorParameters<typeof Doc>[0];

export type ExcelProps = EditorProps & {
  doc?: Doc;
  docConfig?: DocConfig;
} & Pick<StateContextValue, 'provider' | 'awareness'>;

export const Excel: React.FunctionComponent<ExcelProps> = memo((props) => {
  const { doc, provider, awareness, docConfig } = props;

  const [value, setValue] = useState<StateContextValue | undefined>(undefined);

  useEffect(() => {
    i18n.init();
    if (RTL_LANGUAGE_LIST.includes(i18n.current as any)) {
      document.documentElement.dataset.layoutDirection = 'rtl';
    }

    let realDoc: Doc | undefined = undefined;

    if (doc) {
      realDoc = doc;
    } else {
      realDoc = docConfig ? new Doc(docConfig) : new Doc();
    }

    const controller = initController({
      worker: new Worker(),
      doc: realDoc,
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
