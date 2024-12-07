import styles from './index.module.css';
import { memo, useEffect, useState } from 'react';
import FormulaBarContainer from './FormulaBar';
import ToolbarContainer from './ToolBar';
import CanvasContainer from './canvas';
import SheetBarContainer from './SheetBar';
import MenuBarContainer, { ProviderStatus } from './MenuBar';
import { useExcel } from './store';
import { applyUpdate } from '../collaboration';
import { Loading } from '../components';
import { isTestEnv } from '@excel/shared';

const App = memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>(
    ProviderStatus.LOCAL,
  );
  const { provider, controller } = useExcel();
  useEffect(() => {
    if (isTestEnv()) {
      return;
    }
    setIsLoading(true);
    provider
      ?.retrieveHistory()
      .then((result: Uint8Array[]) => {
        if (result.length > 0) {
          applyUpdate(provider.doc, result);
        } else {
          controller.addSheet();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [provider, controller]);

  useEffect(() => {
    function handleEvent() {
      if (provider?.isOnline()) {
        setProviderStatus(ProviderStatus.SYNCING);
        provider
          ?.syncData()
          .finally(() =>
            setProviderStatus(
              provider?.isOnline()
                ? ProviderStatus.ONLINE
                : ProviderStatus.LOCAL,
            ),
          );
      }
    }
    window.addEventListener('online', handleEvent);
    window.addEventListener('offline', handleEvent);
    return () => {
      window.removeEventListener('online', handleEvent);
      window.removeEventListener('online', handleEvent);
    };
  }, [provider]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className={styles['app-container']} data-testid="app-container">
      <MenuBarContainer providerStatus={providerStatus} />
      <ToolbarContainer />
      <FormulaBarContainer />
      <CanvasContainer />
      <SheetBarContainer />
    </div>
  );
});
App.displayName = 'App';

export * from './store';
export * from './MenuBar';
export {
  App,
  ToolbarContainer,
  FormulaBarContainer,
  CanvasContainer,
  SheetBarContainer,
};
