import React, { useRef } from 'react';
import { IController } from '@/types';
import { Button } from '../components';
import { generateUUID } from '@/util';
import { $ } from '@/i18n';

interface Props {
  controller: IController;
}
export const InsertFloatingPicture: React.FunctionComponent<Props> = ({
  controller,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const readImage = (base64Image: string, fileName: string) => {
    const image = new Image();
    image.src = base64Image;
    image.onload = function () {
      const range = controller.getActiveCell();
      controller.addFloatElement({
        width: image.width,
        height: image.height,
        originHeight: image.height,
        originWidth: image.width,
        title: fileName,
        type: 'floating-picture',
        uuid: generateUUID(),
        imageSrc: base64Image,
        sheetId: range.sheetId,
        fromRow: range.row,
        fromCol: range.col,
        marginX: 0,
        marginY: 0,
      });
    };
  };
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    let fileName = file.name;
    const fileType = file.type.slice('image/'.length);
    fileName = fileName.slice(0, -(fileType.length + 1));
    const reader = new FileReader();
    reader.onload = function (e) {
      ref.current!.value = '';
      ref.current!.blur();
      const base64Image = e.target?.result;
      if (!base64Image || typeof base64Image !== 'string') {
        return;
      }
      readImage(base64Image, fileName);
    };

    reader.readAsDataURL(file);
  };
  return (
    <Button testId='toolbar-floating-picture'>
      <input
        type="file"
        hidden
        onChange={handleImport}
        accept="image/*"
        ref={ref}
        id="upload_float_image"
      />
      <label htmlFor="upload_float_image">{$('floating-picture')}</label>
    </Button>
  );
};

export const InsertChart: React.FunctionComponent<Props> = ({ controller }) => {
  const handleClick = () => {
    const range = controller.getActiveCell();
    controller.addFloatElement({
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
  };

  return <Button testId='toolbar-chart' onClick={handleClick}>{$('chart')}</Button>;
};
