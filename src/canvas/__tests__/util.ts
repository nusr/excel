import { OffScreenWorker } from '../offScreenWorker';
import { createCanvas } from 'canvas';
import { setDpr, getTheme, headerSizeSet } from '@/util';
import { IController, RequestMessageType, ChangeEventType } from '@/types';
import fs from 'fs';
import path from 'path';
import pixelMatch from 'pixelmatch';
import PNG from 'pngjs';

const defaultWidth = 200;
const defaultHeight = 100;

function getRenderData(controller: IController) {
  const jsonData = controller.toJSON();
  const currentId = controller.getCurrentSheetId();
  const sheetInfo = controller.getSheetInfo(currentId)!;
  const eventData: RequestMessageType = {
    status: 'render',
    changeSet: new Set<ChangeEventType>(['scroll', 'cellStyle', 'cellValue']),
    theme: getTheme(),
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

async function compareImage(basePath: string, newImageBuffer: Buffer) {
  const baseBuffer = await fs.promises.readFile(basePath);
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
      threshold: 0.1,
    },
  );
  if (result > 0) {
    const diffPath = basePath.replace('.png', '.diff.png');
    await fs.promises.writeFile(diffPath, PNG.PNG.sync.write(diff));
  }
  return result;
}

export async function snapshot(controller: IController) {
  setDpr(2);
  const canvas = createCanvas(defaultWidth, defaultHeight);
  const instance = new OffScreenWorker(canvas as any);
  instance.resize({ width: defaultWidth, height: defaultHeight });
  instance.render(getRenderData(controller));

  let imageName = (expect.getState().currentTestName || '').replaceAll(
    ' ',
    '_',
  );
  imageName = encodeURIComponent(imageName) + '.png';
  const imageDir = path.join(__dirname, './static');
  if (!fs.existsSync(imageDir)) {
    await fs.promises.mkdir(imageDir);
  }
  const imagePath = path.join(imageDir, imageName);
  const buffer = canvas.toBuffer('image/png');
  const check = fs.existsSync(imagePath);
  if (check) {
    expect(await compareImage(imagePath, buffer)).toEqual(0);
  } else {
    await fs.promises.writeFile(imagePath, buffer);
  }
}
