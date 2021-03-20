import React, { memo, useRef, useEffect } from "react";
import styled from "styled-components";
import { CellEditorContainer } from "../CellEditor";
import { Main } from "@/canvas";
import { Interaction } from "@/interaction";
import { useController } from "@/store";

const ContentContainer = styled.div`
  position: relative;
`;

export const CanvasContainer = memo(() => {
  const controller = useController();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvasDom = canvasRef.current;
    new Main(controller, canvasDom);
    const interaction = new Interaction(controller, canvasDom);
    return () => {
      interaction.removeEvents();
    };
  }, [controller]);

  return (
    <ContentContainer>
      <canvas ref={canvasRef} />
      <CellEditorContainer />
    </ContentContainer>
  );
});

CanvasContainer.displayName = "CanvasContainer";
