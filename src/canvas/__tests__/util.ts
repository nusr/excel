import { OffScreenWorker } from '../offScreenWorker';
import { createCanvas, Canvas } from 'canvas';
import { setDpr, headerSizeSet, npx, dpr } from '@/util';
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

beforeAll(async () => {
  const imageDir = path.join(__dirname, './static');
  if (!fs.existsSync(imageDir)) {
    await fs.promises.mkdir(imageDir);
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
  if (result > 0) {
    const diffPath = basePath.replace('.png', '.diff.png');
    await fs.promises.writeFile(diffPath, PNG.PNG.sync.write(diff));
  }
  return result;
}

function screenShot(canvas: Canvas) {
  const size = dpr();
  const ctx = canvas.getContext('2d');
  const headerSize = headerSizeSet.get();
  const x = headerSize.width;
  const y = headerSize.height;
  const width = defaultWidth - x;
  const height = defaultHeight - y;
  const realCanvas = createCanvas(width, height);
  realCanvas.width = npx(width);
  realCanvas.height = npx(height);
  const imageData = ctx.getImageData(npx(x), npx(y), npx(width), npx(height));
  const newCtx = realCanvas.getContext('2d');
  newCtx.scale(size, size);
  newCtx.putImageData(imageData, 0, 0);
  return realCanvas.toBuffer('image/png');
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

export async function snapshot(
  controller: IController,
  options?: { theme?: ThemeType; isScreenShot?: boolean },
) {
  const { theme = 'light', isScreenShot = true } = options || {};
  setDpr(2);

  const canvas = renderCanvas(controller, theme);
  let imageName = (expect.getState().currentTestName || '').replaceAll(
    ' ',
    '_',
  );
  imageName = encodeURIComponent(imageName) + '.png';
  const imageDir = path.join(__dirname, './static');
  const imagePath = path.join(imageDir, imageName);
  let buffer: Buffer;
  if (isScreenShot) {
    buffer = buffer = screenShot(canvas);
  } else {
    buffer = canvas.toBuffer('image/png');
  }
  let baseBuffer: Buffer;
  try {
    baseBuffer = await fs.promises.readFile(imagePath);
  } catch (error) {
    if ((error as any).code === 'ENOENT') {
      await fs.promises.writeFile(imagePath, buffer);
      return;
    }
    throw error;
  }
  const result = await compareImage(imagePath, baseBuffer, buffer);
  expect(result).toEqual(0);
}
