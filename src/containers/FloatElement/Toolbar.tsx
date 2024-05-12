import React, { useRef, memo, useCallback } from 'react';
import { IController } from '@/types';
import { Button } from '../../components';
import { generateUUID, getImageSize } from '@/util';
import { $ } from '@/i18n';

interface Props {
  controller: IController;
}

function convertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const base64Image = event.target?.result;
      if (!base64Image || typeof base64Image !== 'string') {
        resolve('');
      } else {
        resolve(base64Image);
      }
    };
    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}

export const InsertFloatingPicture: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const ref = useRef<HTMLInputElement>(null);

    const handleImport = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
          return;
        }
        let fileName = file.name;
        const fileType = file.type.slice('image/'.length);
        fileName = fileName.slice(0, -(fileType.length + 1));

        const base64 = await convertToBase64(file);
        if (ref.current) {
          ref.current.value = '';
          ref.current.blur();
        }
        if (!base64) {
          return;
        }
        const size = await getImageSize(base64);
        const range = controller.getActiveRange().range;
        await controller.addDrawing({
          width: size.width,
          height: size.height,
          originHeight: size.height,
          originWidth: size.width,
          title: fileName,
          type: 'floating-picture',
          uuid: generateUUID(),
          imageSrc: base64,
          sheetId: range.sheetId,
          fromRow: range.row,
          fromCol: range.col,
          marginX: 0,
          marginY: 0,
        });
      },
      [],
    );
    return (
      <Button testId="toolbar-floating-picture" title="Floating Picture">
        <input
          type="file"
          hidden
          onChange={handleImport}
          accept="image/*"
          ref={ref}
          id="upload_float_image"
          data-testid="toolbar-floating-picture-input"
        />
        <label htmlFor="upload_float_image">{$('floating-picture')}</label>
      </Button>
    );
  },
);
InsertFloatingPicture.displayName = 'InsertFloatingPicture';

export const InsertChart: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const handleClick = useCallback(async () => {
      const range = controller.getActiveRange().range;
      await controller.addDrawing({
        width: 400,
        height: 300,
        originHeight: 300,
        originWidth: 400,
        title: $('chart-title'),
        type: 'chart',
        uuid: generateUUID(),
        sheetId: range.sheetId,
        fromRow: range.row,
        fromCol: range.col,
        chartRange: range,
        chartType: 'line',
        marginX: 0,
        marginY: 0,
      });
    }, []);

    return (
      <Button testId="toolbar-chart" onClick={handleClick} title="Chart">
        {$('chart')}
      </Button>
    );
  },
);

InsertChart.displayName = 'InsertChart';
