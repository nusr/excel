import React, { memo, useCallback } from "react";
import { Button, Github, BaseIcon, Select, ColorPicker } from "@/components";
import { useSelector, useController } from "@/store";
import { StyleType } from "@/types";
import {
  FONT_SIZE_LIST,
  DEFAULT_FONT_SIZE,
  isNumber,
  DEFAULT_FONT_COLOR,
  DEFAULT_FONT_FAMILY,
} from "@/util";
import { useFontFamily } from "@/hooks";

const colorPickerStyle = { marginLeft: 8 };

export const ToolbarContainer = memo(() => {
  const [fontFamilyList] = useFontFamily();
  const controller = useController();
  const { activeCell, canRedo, canUndo } = useSelector([
    "activeCell",
    "canRedo",
    "canUndo",
  ]);
  const { style = {} } = activeCell;
  const {
    isBold,
    isItalic,
    fontSize = DEFAULT_FONT_SIZE,
    fontColor = DEFAULT_FONT_COLOR,
    fillColor,
    fontFamily,
  } = style;
  const setCellStyle = useCallback(
    (value: Partial<StyleType>) => {
      controller.setCellStyle(value);
    },
    [controller]
  );
  const handleFontSize = useCallback(
    (value) => {
      if (isNumber(value)) {
        const realValue = parseFloat(value);
        setCellStyle({ fontSize: realValue });
      }
    },
    [setCellStyle]
  );
  const getItemStyle = useCallback((value) => {
    return { fontFamily: value };
  }, []);
  return (
    <div className="toolbar-wrapper" id="tool-bar-container">
      <Button disabled={!canUndo} onClick={controller.undo}>
        <BaseIcon name="undo" />
      </Button>
      <Button disabled={!canRedo} onClick={controller.redo}>
        <BaseIcon name="redo" />
      </Button>
      <Button active={isBold} onClick={() => setCellStyle({ isBold: !isBold })}>
        <BaseIcon name="bold" />
      </Button>
      <Button
        active={isItalic}
        onClick={() => setCellStyle({ isItalic: !isItalic })}
      >
        <BaseIcon name="italic" />
      </Button>
      <Select
        data={fontFamilyList}
        style={colorPickerStyle}
        value={fontFamily || DEFAULT_FONT_FAMILY}
        onChange={(item) => setCellStyle({ fontFamily: item })}
        getItemStyle={getItemStyle}
      />
      <Select
        data={FONT_SIZE_LIST}
        value={fontSize}
        style={colorPickerStyle}
        onChange={handleFontSize}
      />
      <ColorPicker
        color={fontColor}
        style={colorPickerStyle}
        onChange={(color) => setCellStyle({ fontColor: color })}
      >
        <BaseIcon name="fontColor" />
      </ColorPicker>
      <ColorPicker
        color={fillColor || ""}
        style={colorPickerStyle}
        onChange={(color) => setCellStyle({ fillColor: color })}
      >
        <BaseIcon name="fillColor" />
      </ColorPicker>
      <Github />
    </div>
  );
});

ToolbarContainer.displayName = "ToolbarContainer";
