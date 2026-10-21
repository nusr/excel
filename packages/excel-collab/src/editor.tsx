import {
  ExcelEditor,
  EditorProps,
  StateContext,
  StateContextValue,
} from './containers';
import { memo, useEffect, useRef, useState } from 'react';
import { initController } from './controller';
import Worker from './worker?worker&inline';
import { Doc } from 'yjs';
import i18n from './i18n';
import { RTL_LANGUAGE_LIST } from './util/constant';

export type DocConfig = ConstructorParameters<typeof Doc>[0];

export type ExcelProps = EditorProps & {
  doc?: Doc;
  docConfig?: DocConfig;
} & Pick<StateContextValue, 'provider' | 'awareness' | 'whenSynced'>;

export const Excel: React.FunctionComponent<ExcelProps> = memo((props) => {
  const { doc, provider, awareness, docConfig, whenSynced } = props;

  const [value, setValue] = useState<(StateContextValue & { editorKey: number }) | undefined>(undefined);
  const generation = useRef(0);

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

    const worker = new Worker();
    try {
      const controller = initController({
        worker,
        doc: realDoc,
      });
      setValue({ controller, provider, awareness, whenSynced, collaborative: Boolean(doc), editorKey: ++generation.current });
      return () => {
        controller.destroy();
        worker.terminate();
        if (!doc) realDoc.destroy();
      };
    } catch (error) {
      worker.terminate();
      if (!doc) realDoc.destroy();
      throw error;
    }
  }, [doc, provider, awareness, whenSynced, docConfig]);

  return (
    <StateContext.Provider value={value}>
      {value && <ExcelEditor key={value.editorKey} {...props} />}
    </StateContext.Provider>
  );
});

Excel.displayName = 'Excel';
