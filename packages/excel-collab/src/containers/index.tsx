import styles from './index.module.css';
import { memo, useEffect, useState } from 'react';
import FormulaBarContainer from './FormulaBar';
import ToolbarContainer from './ToolBar';
import CanvasContainer from './canvas';
import SheetBarContainer from './SheetBar';
import MenuBarContainer from './MenuBar';
import { useExcel, useUserInfo } from './store';
import { UserItem } from '../types';
import i18n from '../i18n';
import { ProgressCircle } from '../component/ProgressCircle';

function useCollaboration() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();
  const setFileInfo = useUserInfo((s) => s.setFileInfo);
  const { provider, controller, awareness, whenSynced, collaborative } = useExcel();
  useEffect(() => {
    let cancelled = false;
    async function init() {
      setIsLoading(true);
      setError(undefined);
      if (whenSynced) await whenSynced;
      if (cancelled) return;
      if (provider) {
        const doc = controller.getHooks().doc;
        const file = await provider.getDocument?.(doc.guid);
        if (cancelled) return;
        const content = file?.content ?? '';
        if (content && !collaborative && controller.getSheetList().length === 0) {
          controller.fromJSON(JSON.parse(content));
        }
        setFileInfo(file?.id ?? doc.guid, file?.name ?? '');
      }
      if (controller.getSheetList().length === 0) {
        if (collaborative) throw new Error('The collaboration server must initialize the workbook before the first sync');
        controller.addFirstSheet();
      }
      setIsLoading(false);
    }
    init().catch((cause: unknown) => {
      if (!cancelled) {
        setError(cause instanceof Error ? cause.message : String(cause));
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [controller, provider, whenSynced, collaborative, setFileInfo]);

  useEffect(() => {
    if (!awareness) {
      return;
    }
    const doc = controller.getHooks().doc;
    const handleAwareness = () => {
      const list: UserItem[] = [];
      for (const item of awareness.getStates().entries()) {
        const [key, value] = item;
        if (!value.range || key === doc.clientID) {
          continue;
        }
        list.push({ clientId: key, range: value.range });
      }
      useUserInfo.getState().setUsers(list);
    };
    awareness.on('update', handleAwareness);
    handleAwareness();
    const offRange = controller.on('rangeChange', (range) => {
      awareness.setLocalStateField('range', range);
    });
    return () => {
      awareness.off('update', handleAwareness);
      offRange();
      awareness.setLocalStateField('range', null);
      useUserInfo.getState().setUsers([]);
    };
  }, [controller, awareness]);

  return {
    isLoading, error,
  };
}

export type EditorProps = {
  style?: React.CSSProperties;
  menubarLeftChildren?: React.ReactNode;
  menubarRightChildren?: React.ReactNode;
  toolbarChildren?: React.ReactNode;
  sheetBarChildren?: React.ReactNode;
};
const ExcelEditor: React.FunctionComponent<EditorProps> = memo(
  ({
    style,
    menubarLeftChildren,
    menubarRightChildren,
    toolbarChildren,
    sheetBarChildren,
  }) => {
    const { isLoading, error } = useCollaboration();

    if (error) return <div role="alert">{i18n.t('initialization-failed', { message: error })}</div>;

    if (isLoading) {
      return (
        <ProgressCircle
          value={60}
          size={64}
          isIndeterminate
          aria-label="Loading editor"
        />
      );
    }

    return (
      <div
        className={styles['app-container']}
        data-testid="app-container"
        style={style}
      >
        <MenuBarContainer
          leftChildren={menubarLeftChildren}
          rightChildren={menubarRightChildren}
        />
        <ToolbarContainer>{toolbarChildren}</ToolbarContainer>
        <FormulaBarContainer />
        <CanvasContainer />
        <SheetBarContainer>{sheetBarChildren}</SheetBarContainer>
      </div>
    );
  },
);

ExcelEditor.displayName = 'ExcelEditor';

export * from './store';
export * from './MenuBar';
export {
  ExcelEditor,
  useCollaboration,
  ToolbarContainer,
  FormulaBarContainer,
  CanvasContainer,
  SheetBarContainer,
};
