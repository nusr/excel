import React, { memo, useCallback } from "react";
import styled, { withTheme } from "styled-components";
import { Button, Github, BaseIcon, Select, ColorPicker } from "@/components";
import { getSingletonController } from "@/controller";
import { useSelector } from "@/store";
import { StyleType } from "@/types";
import {
  FONT_SIZE_LIST,
  DEFAULT_FONT_SIZE,
  isNumber,
  DEFAULT_FONT_COLOR,
  FONT_FAMILY_LIST,
  DEFAULT_FONT_FAMILY,
} from "@/util";

export const ToolbarContainer = withTheme(styled.div`
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  height: 40px;
  background-color: #f3f3f3;
  border-bottom: 1px solid ${(props) => props.theme.gridStrokeColor};
  display: flex;
  align-items: center;
`);

const colorPickerStyle = { marginLeft: 8 };

export const Toolbar = memo(() => {
  const { activeCell } = useSelector(["activeCell"]);
  const { style = {} } = activeCell;
  const {
    isBold,
    isItalic,
    fontSize = DEFAULT_FONT_SIZE,
    fontColor = DEFAULT_FONT_COLOR,
    fillColor,
    fontFamily,
  } = style;
  const setCellStyle = useCallback((value: Partial<StyleType>) => {
    getSingletonController().setCellStyle(value);
  }, []);
  const handleFontSize = useCallback(
    (value) => {
      if (isNumber(value)) {
        const realValue = parseFloat(value);
        setCellStyle({ fontSize: realValue });
      }
    },
    [setCellStyle]
  );
  return (
    <ToolbarContainer id="tool-bar-container">
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
        data={FONT_FAMILY_LIST}
        value={fontFamily || DEFAULT_FONT_FAMILY}
        onChange={(item) => setCellStyle({ fontFamily: item })}
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
        A
      </ColorPicker>
      <ColorPicker
        color={fillColor || ""}
        style={colorPickerStyle}
        onChange={(color) => setCellStyle({ fillColor: color })}
      >
        F
      </ColorPicker>
      <Github />
    </ToolbarContainer>
  );
});

Toolbar.displayName = "Toolbar";
