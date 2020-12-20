import React, { memo, useCallback } from "react";
import styled from "styled-components";
import { Button, Github } from "@/components";

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
      <Button onClick={handleBold}>B</Button>
      <Button style={italicStyle} onClick={handleItalic}>
        I
      </Button>
      <Button style={underlineStyle} onClick={handleUnderline}>
        U
      </Button>
      <Github />
    </ToolbarContainer>
  );
});

Toolbar.displayName = "Toolbar";
