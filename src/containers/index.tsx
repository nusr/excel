import styles from './index.module.css';
import { memo, useEffect, useState } from 'react';
import FormulaBarContainer from './FormulaBar';
import ToolbarContainer from './ToolBar';
import CanvasContainer from './canvas';
import SheetBarContainer from './SheetBar';
import MenuBarContainer from './MenuBar';
import { useExcel, useUserInfo } from './store';
import { Loading } from '../components';
import { applyUpdate } from '../util';
import { ProviderStatus } from '../types';

function useCollaboration() {
  const [isLoading, setIsLoading] = useState(true);
  const setFileInfo = useUserInfo((s) => s.setFileInfo);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>(
    ProviderStatus.LOCAL,
  );
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
      const file = await provider?.getDocument?.();
      const doc = controller.getHooks().doc;
      setFileInfo(file?.id ?? '', file?.name ?? '');
      const result = await provider?.retrieveHistory?.();
      if (result && result.length > 0 && doc) {
        applyUpdate(doc, result);
      }
      if (controller.getSheetList().length === 0) {
        controller.addFirstSheet();
      }
      setIsLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    function handleEvent() {
      if (navigator.onLine) {
        setProviderStatus(ProviderStatus.SYNCING);
        provider
          ?.syncData?.()
          .finally(() =>
            setProviderStatus(
              navigator.onLine ? ProviderStatus.ONLINE : ProviderStatus.LOCAL,
            ),
          );
      }
    }
    window.addEventListener('online', handleEvent);
    window.addEventListener('offline', handleEvent);
    return () => {
      window.removeEventListener('online', handleEvent);
      window.removeEventListener('offline', handleEvent);
    };
  }, []);
  return {
    isLoading,
    providerStatus,
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
