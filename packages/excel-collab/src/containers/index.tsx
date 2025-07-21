import styles from './index.module.css';
import { memo, useEffect, useState } from 'react';
import FormulaBarContainer from './FormulaBar';
import ToolbarContainer from './ToolBar';
import CanvasContainer from './canvas';
import SheetBarContainer from './SheetBar';
import MenuBarContainer from './MenuBar';
import { useExcel, useUserInfo } from './store';
import { UserItem } from '../types';
import { modelToChangeSet } from '../util';
import { Loading } from '../components';

function useCollaboration() {
  const [isLoading, setIsLoading] = useState(true);
  const setFileInfo = useUserInfo((s) => s.setFileInfo);
  const { provider, controller, awareness } = useExcel();
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

  useEffect(() => {
    if (!awareness) {
      return;
    }
    const doc = controller.getHooks().doc;
    awareness.on('update', () => {
      const list: UserItem[] = [];
      for (const item of awareness.getStates().entries()) {
        const [key, value] = item;
        if (!value.range || key === doc.clientID) {
          continue;
        }
        list.push({ clientId: key, range: value.range });
      }
      useUserInfo.getState().setUsers(list);
    });

    doc.on('update', (_a, _b, _c, tran) => {
      const changeSet = modelToChangeSet(tran);
      controller.emit('renderChange', { changeSet });
    });

    controller.on('rangeChange', (range) => {
      awareness.setLocalStateField('range', range);
    });
  }, []);

  return {
    isLoading,
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
    const { isLoading } = useCollaboration();

    if (isLoading) {
      return <Loading />;
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
