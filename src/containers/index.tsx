import styles from './index.module.css';
import { memo, useEffect, useState } from 'react';
import FormulaBarContainer from './FormulaBar';
import ToolbarContainer from './ToolBar';
import CanvasContainer from './canvas';
import SheetBarContainer from './SheetBar';
import MenuBarContainer from './MenuBar';
import { useExcel, useUserInfo } from './store';
import { Loading } from '../components';
import { ProviderStatus } from '../types';

function useCollaboration() {
  const [isLoading, setIsLoading] = useState(true);
  const setFileInfo = useUserInfo((s) => s.setFileInfo);
  const { provider, controller } = useExcel();
  useEffect(() => {
    async function init() {
      if (!provider) {
        if (controller.getSheetList().length === 0) {
          controller.addFirstSheet();
        }
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      const doc = controller.getHooks().doc;
      const file = await provider?.getDocument?.(doc.guid);
      if (!file) {
        await provider.addDocument?.(doc.guid);
      }
      const content = file?.content ?? '';
      if (content) {
        controller.fromJSON(JSON.parse(content));
      }
      setFileInfo(file?.id ?? doc.guid, file?.name ?? '');
      if (controller.getSheetList().length === 0) {
        controller.addFirstSheet();
      }
      setIsLoading(false);
    }
    init();
  }, []);

  return {
    isLoading,
    providerStatus: navigator.onLine
      ? ProviderStatus.ONLINE
      : ProviderStatus.LOCAL,
  };
}

type Props = {
  style?: React.CSSProperties;
  providerStatus?: ProviderStatus;
};
const ExcelEditor: React.FunctionComponent<Props> = memo(
  ({ style, providerStatus }) => {
    return (
      <div
        className={styles['app-container']}
        data-testid="app-container"
        style={style}
      >
        <MenuBarContainer providerStatus={providerStatus} />
        <ToolbarContainer />
        <FormulaBarContainer />
        <CanvasContainer />
        <SheetBarContainer />
      </div>
    );
  },
);

ExcelEditor.displayName = 'ExcelEditor';

const Excel: React.FunctionComponent<Omit<Props, 'providerStatus'>> = memo(
  (props) => {
    const { isLoading, providerStatus } = useCollaboration();
    if (isLoading) {
      return <Loading />;
    }

    return <ExcelEditor {...props} providerStatus={providerStatus} />;
  },
);

Excel.displayName = 'Excel';

export * from './store';
export * from './MenuBar';
export {
  Excel,
  ExcelEditor,
  useCollaboration,
  ToolbarContainer,
  FormulaBarContainer,
  CanvasContainer,
  SheetBarContainer,
};
