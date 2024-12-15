import styles from './index.module.css';
import { memo, useEffect, useState } from 'react';
import FormulaBarContainer from './FormulaBar';
import ToolbarContainer from './ToolBar';
import CanvasContainer from './canvas';
import SheetBarContainer from './SheetBar';
import MenuBarContainer from './MenuBar';
import { useExcel, userStore, fileStore } from './store';
import { applyUpdate } from '../collaboration';
import { Loading } from '../components';
import { eventEmitter } from '../util';
import { ProviderStatus } from '../types';

export function useCollaboration() {
  const [isLoading, setIsLoading] = useState(true);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>(
    ProviderStatus.LOCAL,
  );
  const { provider, controller } = useExcel();
  useEffect(() => {
    async function init() {
      if (!provider) {
        return;
      }
      setIsLoading(true);
      const file = await provider?.getDocument();
      fileStore.setState({
        id: file?.id ?? '',
        name: file?.name ?? '',
        clientId: provider.doc.clientID,
      });
      const result = await provider?.retrieveHistory();
      if (result.length > 0) {
        applyUpdate(provider.doc, result);
      } else if (controller.getSheetList().length === 0) {
        controller.addFirstSheet();
      }
      setIsLoading(false);
    }
    init();
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
    eventEmitter.on('awarenessChange', ({ users }) => {
      userStore.setState(users);
    });
    return () => {
      window.removeEventListener('online', handleEvent);
      window.removeEventListener('online', handleEvent);
      eventEmitter.off('awarenessChange');
    };
  }, [provider]);
  return {
    isLoading,
    providerStatus,
  };
}

const App = memo(({ providerStatus }: { providerStatus?: ProviderStatus }) => {
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

const AppWithCollaboration = memo(() => {
  const { isLoading, providerStatus } = useCollaboration();
  if (isLoading) {
    return <Loading />;
  }
  return <App providerStatus={providerStatus} />;
});
AppWithCollaboration.displayName = 'AppWithCollaboration';

export * from './store';
export * from './MenuBar';
export {
  App,
  AppWithCollaboration,
  ToolbarContainer,
  FormulaBarContainer,
  CanvasContainer,
  SheetBarContainer,
};
