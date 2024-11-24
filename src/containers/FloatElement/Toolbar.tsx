import React, { useRef, memo, useCallback } from 'react';
import { Button, toast } from '../../components';
import {
  generateUUID,
  getImageSize,
  convertFileToTextOrBase64,
  toIRange,
} from '../../util';
import { $ } from '../../i18n';
import { useExcel } from '../store';

export const InsertFloatingPicture = memo(() => {
  const { controller, updateFile } = useExcel();
  const ref = useRef<HTMLInputElement>(null);

  const handleImport = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const clearUpdate = () => {
        if (ref.current) {
          ref.current.value = '';
          ref.current.blur();
        }
      };
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }
      const maxSizeInBytes = 25 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error('max image file size 25MB');
        clearUpdate();
        return;
      }
      let fileName = file.name;
      const fileType = file.type.slice('image/'.length);
      fileName = fileName.slice(0, -(fileType.length + 1));

      const base64 = await convertFileToTextOrBase64(file, true);

      if (!base64) {
        clearUpdate();
        return;
      }
      const size = await getImageSize(base64);
      const imageSrc = await updateFile(file, base64);
      if (!imageSrc) {
        toast.warning('choose image file');
        clearUpdate();
        return;
      }
      const range = controller.getActiveRange().range;
      await controller.addDrawing({
        width: size.width,
        height: size.height,
        originHeight: size.height,
        originWidth: size.width,
        title: fileName,
        type: 'floating-picture',
        uuid: generateUUID(),
        imageSrc,
        sheetId: range.sheetId,
        fromRow: range.row,
        fromCol: range.col,
        marginX: 0,
        marginY: 0,
      });
      clearUpdate();
    },
    [updateFile],
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
});
InsertFloatingPicture.displayName = 'InsertFloatingPicture';

export const InsertChart = memo(() => {
  const { controller } = useExcel();
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
      chartRange: toIRange(range),
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
});

InsertChart.displayName = 'InsertChart';
