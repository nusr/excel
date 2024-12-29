import styles from './index.module.css';
import { memo, useEffect, useState } from 'react';
import FormulaBarContainer from './FormulaBar';
import ToolbarContainer from './ToolBar';
import CanvasContainer from './canvas';
import SheetBarContainer from './SheetBar';
import MenuBarContainer from './MenuBar';
import { useExcel, useUserInfo } from './store';
import { applyUpdate } from '../collaboration';
import { Loading, toast } from '../components';
import { eventEmitter, KEY_LIST, reactLog } from '../util';
import { ProviderStatus, ChangeEventType } from '../types';
import type { Session } from '@supabase/supabase-js';

function useCollaboration() {
  const [isLoading, setIsLoading] = useState(true);
  const setClientId = useUserInfo((s) => s.setClientId);
  const setUserInfo = useUserInfo((s) => s.setUserInfo);
  const setUsers = useUserInfo((s) => s.setUsers);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>(
    ProviderStatus.LOCAL,
  );
  const { provider, controller } = useExcel();
  useEffect(() => {
    const changeSet = new Set<ChangeEventType>([
      ...KEY_LIST,
      'scroll',
      'cellValue',
      'cellStyle',
      'antLine',
      'undo',
      'redo',
    ]);

    function handleSession(session: Session | null | undefined) {
      reactLog('session:', session);
      const name = session?.user.user_metadata.user_name;
      const id = session?.user.user_metadata.provider_id;
      setUserInfo(id || '', name || '');
    }

    async function init() {
      if (!provider) {
        return eventEmitter.emit('renderChange', {
          changeSet,
        });
      }
      provider?.setAuthChangeCallback((_event, session) => {
        handleSession(session);
      });
      await provider?.getLoginInfo();
      setIsLoading(true);
      const file = await provider?.getDocument();
      useUserInfo.setState({
        fileId: file?.id ?? '',
        fileName: file?.name ?? '',
        clientId: provider.doc.clientID,
      });
      const result = await provider?.retrieveHistory();
      if (result.length > 0) {
        applyUpdate(provider.doc, result);
      }
      if (controller.getSheetList().length === 0) {
        controller.addFirstSheet();
      }
      eventEmitter.emit('renderChange', {
        changeSet,
      });
      setIsLoading(false);
    }
    init();
  }, []);

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
    setClientId(provider?.doc.clientID ?? 0);
    provider?.setAwarenessChangeCallback((users) => {
      setUsers(users);
    });
    eventEmitter.on('rangeChange', ({ range }) => {
      const user = useUserInfo.getState();
      provider?.syncRange({
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
      window.removeEventListener('online', handleEvent);
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
  enableLogin?: boolean;
};
const ExcelEditor: React.FunctionComponent<Props> = memo(
  ({ style, providerStatus, enableLogin }) => {
    return (
      <div
        className={styles['app-container']}
        data-testid="app-container"
        style={style}
      >
        <MenuBarContainer
          providerStatus={providerStatus}
          enableLogin={enableLogin}
        />
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

Excel.displayName = 'ExcelEditor';

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
