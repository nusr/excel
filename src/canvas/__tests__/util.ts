import { OffScreenWorker } from '../offScreenWorker';
import { createCanvas } from 'canvas';
import { setDpr, headerSizeSet } from '@/util';
import {
  IController,
  RequestMessageType,
  ChangeEventType,
  ThemeType,
} from '@/types';
import fs from 'fs';
import path from 'path';
import pixelMatch from 'pixelmatch';
import PNG from 'pngjs';

const defaultWidth = 200;
const defaultHeight = 100;
let maxThresholdData = 0;

beforeAll(async () => {
  const imageDir = path.join(__dirname, './static');
  if (!fs.existsSync(imageDir)) {
    await fs.promises.mkdir(imageDir);
  }
});

afterAll(() => {
  if (maxThresholdData > 0) {
    console.log('maxThresholdData: ', maxThresholdData);
  }
});

function getRenderData(controller: IController, theme: ThemeType) {
  const jsonData = controller.toJSON();
  const currentId = controller.getCurrentSheetId();
  const sheetInfo = controller.getSheetInfo(currentId)!;
  const eventData: RequestMessageType = {
    status: 'render',
    changeSet: new Set<ChangeEventType>(['scroll', 'cellStyle', 'cellValue']),
    theme,
    canvasSize: {
      top: 0,
      left: 0,
      width: defaultWidth,
      height: defaultHeight,
    },
    headerSize: headerSizeSet.get(),
    currentSheetInfo: sheetInfo,
    scroll: controller.getScroll(currentId),
    range: controller.getActiveRange().range,
    copyRange: controller.getCopyRange(),
    currentMergeCells: controller.getMergeCellList(currentId),
    customHeight: jsonData.customHeight,
    customWidth: jsonData.customWidth,
    sheetData: jsonData.worksheets[currentId] || {},
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
  if (threshold > 0) {
    console.log(threshold);
  }
  maxThresholdData = Math.max(maxThresholdData, threshold);
  if (threshold > maxThreshold) {
    const diffPath = basePath.replace('.png', '.diff.png');
    await fs.promises.writeFile(diffPath, PNG.PNG.sync.write(diff));
    return 1;
  } else {
    return 0;
  }
}

function renderCanvas(controller: IController, theme: ThemeType) {
  const canvas = createCanvas(defaultWidth, defaultHeight);

  const instance = new OffScreenWorker(canvas as any);
  instance.resize({ width: defaultWidth, height: defaultHeight });
  const data = instance.render(getRenderData(controller, theme));
  if (data) {
    let check = false;
    for (const [row, h] of Object.entries(data.rowMap)) {
      const r = parseInt(row, 10);
      if (h !== controller.getRowHeight(r).len) {
        controller.setRowHeight(r, h);
        check = true;
      }
    }
    for (const [col, w] of Object.entries(data.colMap)) {
      const c = parseInt(col, 10);
      if (w !== controller.getColWidth(c).len) {
        controller.setColWidth(c, w);
        check = true;
      }
    }
    if (check) {
      instance.render(getRenderData(controller, theme));
    }
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
    if ((error as any).code === 'ENOENT') {
      await fs.promises.writeFile(imagePath, newBuffer);
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
