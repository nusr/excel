import { IController } from '@/types';
import { screen, fireEvent } from '@testing-library/react';
import { sleep } from '@/util';
export function type(content: string) {
  fireEvent.click(screen.getByTestId('formula-editor-trigger'));
  fireEvent.change(screen.getByTestId('formula-editor'), {
    currentTarget: { value: content },
    target: { value: content },
  });
  fireEvent.keyDown(screen.getByTestId('formula-editor'), {
    key: 'Enter',
  });

  fireEvent.keyDown(document.body, { key: 'ArrowUp' });
}
export async function addChartByToolbar() {
  type('1');
  await sleep(100);
  fireEvent.click(screen.getByTestId('toolbar-chart'));
}
export function addChart(controller: IController) {
  const sheetId = controller.getCurrentSheetId();
  const range = {
    row: 0,
    col: 0,
    colCount: 1,
    rowCount: 1,
    sheetId,
  };
  controller.setActiveCell(range);
  controller.setCell([[1]], [], range);
  controller.addDrawing({
    title: 'Chart Title',
    type: 'chart',
    uuid: '34bb3922-a9c2-4478-bdd0-9f80baf1b021',
    width: 300,
    height: 300,
    originHeight: 300,
    originWidth: 300,
    marginX: 0,
    marginY: 0,
    sheetId,
    fromCol: 4,
    fromRow: 4,
    chartType: 'bar',
    chartRange: { row: 0, col: 0, colCount: 3, rowCount: 3, sheetId },
  });
}
