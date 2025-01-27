import OffScreenWorker from '../offScreenWorker';
import { createCanvas } from 'canvas';
import {
  IController,
  ChangeEventType,
  ThemeType,
  RequestRender,
} from '../../types';
import fs from 'fs';
import { setDpr } from '../../util';
import path from 'path';
import pixelMatch from 'pixelmatch';
import PNG from 'pngjs';

const defaultWidth = 200;
const defaultHeight = 100;

beforeAll(async () => {
  const imageDir = path.join(__dirname, './static');
  if (!fs.existsSync(imageDir)) {
    await fs.promises.mkdir(imageDir);
  }
});

export function getRenderData(controller: IController, theme: ThemeType) {
  const jsonData = controller.toJSON();
  const currentId = controller.getCurrentSheetId();
  const sheetInfo = controller.getSheetInfo(currentId)!;
  const copyRange = controller.getCopyRange();
  const eventData: RequestRender = {
    changeSet: new Set<ChangeEventType>(['scroll', 'cellStyle', 'worksheets']),
    theme,
    canvasSize: {
      top: 0,
      left: 0,
      width: defaultWidth,
      height: defaultHeight,
    },
    headerSize: controller.getHeaderSize(),
    currentSheetInfo: sheetInfo,
    scroll: controller.getScroll(currentId),
    range: controller.getActiveRange().range,
    copyRange,
    currentMergeCells: controller.getMergeCellList(currentId),
    customHeight: jsonData.customHeight,
    customWidth: jsonData.customWidth,
    sheetData: jsonData.worksheets,
    autoFilter: jsonData.autoFilter[currentId],
  };
  return eventData;
}

async function compareImage(
  basePath: string,
  baseBuffer: Buffer,
  newImageBuffer: Buffer,
  maxThreshold: number,
) {
  const baseImage = PNG.PNG.sync.read(baseBuffer);
  const newImage = PNG.PNG.sync.read(newImageBuffer);
  const { width, height } = baseImage;
  const diff = new PNG.PNG({ width, height });
  const result = pixelMatch(
    baseImage.data,
    newImage.data,
    diff.data,
    width,
    height,
    {
      threshold: 0,
    },
  );
  const threshold = Math.sqrt(result / (width * height));
  if (threshold > maxThreshold) {
    console.log(`threshold: ${threshold},maxThreshold: ${maxThreshold}`);
    const diffPath = basePath.replace('.png', '.diff.png');
    await fs.promises.writeFile(diffPath, PNG.PNG.sync.write(diff) as any);
    return 1;
  } else {
    return 0;
  }
}

function renderCanvas(controller: IController, theme: ThemeType) {
  const canvas = createCanvas(defaultWidth, defaultHeight);

  const instance = new OffScreenWorker(canvas as unknown as OffscreenCanvas);
  instance.resize({ width: defaultWidth, height: defaultHeight });
  const data = instance.render(getRenderData(controller, theme));
  if (data) {
    for (const [row, h] of Object.entries(data.rowMap)) {
      const r = parseInt(row, 10);
      controller.setRowHeight(r, h);
    }
    for (const [col, w] of Object.entries(data.colMap)) {
      const c = parseInt(col, 10);
      controller.setColWidth(c, w);
    }
    instance.render(getRenderData(controller, theme));
  }
  return canvas;
}

export async function compareScreenShot(
  controller: IController,
  options?: { theme?: ThemeType; maxThreshold?: number },
) {
  const { theme = 'light', maxThreshold = 0.1 } = options || {};
  setDpr(2);
  const canvas = renderCanvas(controller, theme);
  const imageName = (expect.getState().currentTestName || '')
    .replaceAll(' ', '_')
    .toLowerCase();
  const imageDir = path.join(__dirname, './static');
  const imagePath = path.join(imageDir, encodeURIComponent(imageName) + '.png');
  const newBuffer = canvas.toBuffer('image/png');
  let baseBuffer: Buffer;
  try {
    baseBuffer = await fs.promises.readFile(imagePath);
  } catch (error) {
    if ((error as unknown as { code: string }).code === 'ENOENT') {
      fs.promises.writeFile(imagePath, newBuffer as any);
      return;
    }
    throw error;
  }
  const result = await compareImage(
    imagePath,
    baseBuffer,
    newBuffer,
    maxThreshold,
  );
  expect(result).toEqual(0);
}
