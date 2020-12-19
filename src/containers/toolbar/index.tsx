import React, { memo } from "react";
import { Container } from "@/components/styled";

export const Toolbar = memo(() => {
  return <Container id="tool-bar-container">Toolbar</Container>;
});

Toolbar.displayName = "Toolbar";
