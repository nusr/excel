import styles from './index.module.css';
import { memo, useEffect, useState } from 'react';
import FormulaBarContainer from './FormulaBar';
import ToolbarContainer from './ToolBar';
import CanvasContainer from './canvas';
import SheetBarContainer from './SheetBar';
import MenuBarContainer from './MenuBar';
import { useExcel, useUserInfo } from './store';
import { Loading, toast } from '../components';
import { eventEmitter, applyUpdate } from '../util';
import { ProviderStatus } from '../types';

function useCollaboration() {
  const [isLoading, setIsLoading] = useState(true);
  const setClientId = useUserInfo((s) => s.setClientId);
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
      const doc = provider?.getDoc?.();
      useUserInfo.setState({
        fileId: file?.id ?? '',
        fileName: file?.name ?? '',
        clientId: doc?.clientID,
      });
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
    setClientId(provider?.getDoc?.().clientID ?? 0);
    eventEmitter.on('rangeChange', ({ range }) => {
      const user = useUserInfo.getState();
      provider?.syncRange?.({
        range,
        userId: user.userId,
        userName: user.userName,
      });
    });
    eventEmitter.on(
      'toastMessage',
      ({ type, message, duration = 5, testId }) => {
        toast({ type, message, duration, testId: testId ?? `${type}-toast` });
      },
    );
    return () => {
      window.removeEventListener('online', handleEvent);
      window.removeEventListener('offline', handleEvent);
      eventEmitter.off('renderChange');
      eventEmitter.off('rangeChange');
      eventEmitter.off('modelChange');
      eventEmitter.off('toastMessage');
    };
  }, []);
  return {
    isLoading: isLoading && Boolean(provider),
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
