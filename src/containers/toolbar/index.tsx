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
        data={FONT_SIZE_LIST}
        value={fontSize}
        onChange={handleFontSize}
      ></Select>
      <ColorPicker
        color={fontColor}
        style={colorPickerStyle}
        onChange={(color) => setCellStyle({ fontColor: color })}
      />
      <Github />
    </ToolbarContainer>
  );
});

Toolbar.displayName = "Toolbar";
