import React, { memo, useCallback } from "react";
import styled from "styled-components";
import { Button, Github, BaseIcon } from "@/components";
export const ToolbarContainer = styled.div`
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  height: 40px;
  line-height: 40px;
`;

const italicStyle = {
  fontStyle: "italic",
};
const underlineStyle = {
  textDecoration: "underline",
};

export const Toolbar = memo(() => {
  const handleBold = useCallback(() => {
    console.log("handleBold");
  }, []);
  const handleItalic = useCallback(() => {
    console.log("handleItalic");
  }, []);
  const handleUnderline = useCallback(() => {
    console.log("handleUnderline");
  }, []);
  return (
    <ToolbarContainer id="tool-bar-container">
      <Button onClick={handleBold}>
        <BaseIcon name="bold" />
      </Button>
      <Button style={italicStyle} onClick={handleItalic}>
        <BaseIcon name="italic" />
      </Button>
      <Button style={underlineStyle} onClick={handleUnderline}>
        <BaseIcon name="underline" />
      </Button>
      <Github />
    </ToolbarContainer>
  );
});

Toolbar.displayName = "Toolbar";
