import { useRef, memo, useCallback } from 'react';
import { Button } from '../../component/Button';
import { getImageSize, convertFileToTextOrBase64, toIRange } from '../../util';
import i18n from '../../i18n';
import { useExcel } from '../store';
import { v4 } from 'uuid';
import { queue } from '../../component/Toast';
import { FileTrigger } from 'react-aria-components/FileTrigger';

export const InsertFloatingPicture = memo(() => {
  const { controller, provider } = useExcel();
  const ref = useRef<HTMLInputElement>(null);

  const handleImport = useCallback(
    async (files: FileList | null) => {
      const clearUpdate = () => {
        if (ref.current) {
          ref.current.value = '';
          ref.current.blur();
        }
      };
      const file = files?.[0];
      if (!file) {
        return;
      }
      const maxSizeInBytes = 25 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        queue.add({ title: 'max image file size 25MB' });
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
      let imageSrc = base64;
      if (provider?.uploadFile) {
        imageSrc = await provider.uploadFile(
          controller.getHooks().doc.guid,
          file,
          base64,
        );
      }
      if (!imageSrc) {
        queue.add({ title: 'choose image file' });
        clearUpdate();
        return;
      }
      const range = controller.getActiveRange().range;
      controller.addDrawing({
        width: size.width,
        height: size.height,
        originHeight: size.height,
        originWidth: size.width,
        title: fileName,
        type: 'floating-picture',
        uuid: v4(),
        imageSrc,
        sheetId: range.sheetId,
        fromRow: range.row,
        fromCol: range.col,
        marginX: 0,
        marginY: 0,
      });
      clearUpdate();
    },
    [provider],
  );
  return (
    <FileTrigger
      ref={ref}
      acceptedFileTypes={['image/*']}
      onSelect={handleImport}
      data-testid="toolbar-floating-picture-input"
    >
      <Button data-testid="toolbar-floating-picture" aria-label="Floating Picture">
        {i18n.t('floating-picture')}
      </Button>
    </FileTrigger>
  );
});
InsertFloatingPicture.displayName = 'InsertFloatingPicture';

export const InsertChart = memo(() => {
  const { controller } = useExcel();
  const handleClick = useCallback(async () => {
    const range = controller.getActiveRange().range;
    controller.addDrawing({
      width: 400,
      height: 300,
      originHeight: 300,
      originWidth: 400,
      title: i18n.t('chart-title'),
      type: 'chart',
      uuid: v4(),
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
    <Button data-testid="toolbar-chart" onPress={handleClick} aria-label="Chart">
      {i18n.t('chart')}
    </Button>
  );
});

InsertChart.displayName = 'InsertChart';
