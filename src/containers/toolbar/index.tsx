import React, { memo, useCallback } from "react";
import styled, { withTheme } from "styled-components";
import { Button, Github, BaseIcon } from "@/components";
import { getSingletonController } from "@/controller";
import { useSelector } from "@/store";
import { StyleType } from "@/types";

export const ToolbarContainer = withTheme(styled.div`
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
  background-color: #f3f3f3;
  border-bottom: 1px solid ${(props) => props.theme.gridStrokeColor};
`);

export const Toolbar = memo(() => {
  const { activeCell } = useSelector(["activeCell"]);
  const { style = {} } = activeCell;
  const { isBold, isUnderline, isItalic } = style;
  const setCellStyle = function (value: Partial<StyleType>): void {
    getSingletonController().setCellStyle(value);
  };
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
      <Button
        active={isUnderline}
        onClick={() => setCellStyle({ isUnderline: !isUnderline })}
      >
        <BaseIcon name="underline" />
      </Button>
      <Github />
    </ToolbarContainer>
  );
});

Toolbar.displayName = "Toolbar";
