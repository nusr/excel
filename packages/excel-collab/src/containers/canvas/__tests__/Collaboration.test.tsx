import { render, act, screen } from '@testing-library/react';
import { Collaboration } from '../Collaboration';
import { useUserInfo, StateContext, useCoreStore } from '../../store';
import { initController } from '../../../controller';
import type { UserItem, IController } from '../../../types';
import '@testing-library/jest-dom/vitest';

function renderComponent() {
  const controller = initController();
  act(() => {
    render(
      <StateContext
        value={{
          controller,
        }}
      >
        <Collaboration />
      </StateContext>,
    );
    controller.addFirstSheet();
    controller.setCanvasSize({ top: 144, left: 0, width: 1300, height: 500 });
    useCoreStore.setState({ currentSheetId: controller.getCurrentSheetId() });
  });

  return { controller };
}

describe('Collaboration Component', () => {
  let controller: IController;
  beforeEach(() => {
    const r = renderComponent();
    controller = r.controller;
    act(() => {
      const first = controller.getCurrentSheetId();
      const second = controller.addSheet()!.sheetId;
      controller.setCurrentSheetId(first);
      useCoreStore.setState({ currentSheetId: first });
      const mockUsers: UserItem[] = [
        {
          clientId: 1,
          range: { sheetId: first, col: 1, row: 1, rowCount: 1, colCount: 1 },
        },
        {
          clientId: 2,
          range: { sheetId: second, col: 2, row: 2, rowCount: 1, colCount: 1 },
        },
      ];
      useUserInfo.getState().setUsers(mockUsers);
    });
  });
  it('should render presence on the first sheet', () => {
    expect(screen.queryByText('User 1')).toBeInTheDocument();
    expect(screen.queryByText('User 2')).toBeNull();
  });

  it('should render presence after changing sheets', () => {
    act(() => {
      controller.setCurrentSheetId(controller.getSheetList()[1].sheetId);
      useCoreStore.setState({ currentSheetId: controller.getCurrentSheetId() });
    });

    expect(screen.queryByText('User 1')).toBeNull();
    expect(screen.queryByText('User 2')).toBeInTheDocument();
  });
});
