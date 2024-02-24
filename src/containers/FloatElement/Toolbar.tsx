import React, { useRef } from 'react';
import { IController, FloatElement } from '@/types';
import { Button } from '../components';
import { generateUUID } from '@/util';

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
      const position = controller.computeCellPosition({
        row: range.row,
        col: range.col,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
      const data: FloatElement = {
        width: image.width,
        height: image.height,
        title: fileName,
        type: 'floating-picture',
        uuid: generateUUID(),
        imageSrc: base64Image,
        sheetId: range.sheetId,
        fromRow: range.row,
        fromCol: range.col,
        top: position.top,
        left: position.left,
      };
      controller.addFloatElement(data);
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
    <Button>
      <input
        type="file"
        style={{ display: 'none' }}
        onChange={handleImport}
        accept="image/*"
        ref={ref}
        id="upload_float_image"
      />
      <label htmlFor="upload_float_image">Floating Picture</label>
    </Button>
  );
};

export const InsertChart: React.FunctionComponent<Props> = ({ controller }) => {
  const handleClick = () => {
    const range = controller.getActiveCell();
    const position = controller.computeCellPosition({
      row: range.row,
      col: range.col,
      rowCount: 1,
      colCount: 1,
      sheetId: '',
    });
    controller.addFloatElement({
      width: 400,
      height: 300,
      title: 'Chart Title',
      type: 'chart',
      uuid: generateUUID(),
      sheetId: range.sheetId,
      fromRow: range.row,
      fromCol: range.col,
      chartRange: range,
      chartType: 'line',
      top: position.top,
      left: position.left,
    });
  };

  return <Button onClick={handleClick}>Chart</Button>;
};
