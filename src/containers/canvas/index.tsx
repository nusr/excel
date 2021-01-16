import React, { memo, useRef, useEffect } from "react";
import styled from "styled-components";
import { CellEditor } from "../CellEditor";
import { getSingletonController } from "@/controller";
import { Main } from "@/canvas";
import { Interaction } from "@/interaction";

const ContentContainer = styled.div`
  position: relative;
`;

export const CanvasContainer = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvasDom = canvasRef.current;
    const controller = getSingletonController();
    new Main(controller, canvasDom);
    const interaction = new Interaction(controller, canvasDom);
    return () => {
      getSingletonController.destroy();
      interaction.removeEvents();
    };
  }, []);

  return (
    <ContentContainer>
      <canvas ref={canvasRef} />
      <CellEditor />
    </ContentContainer>
  );
});

CanvasContainer.displayName = "CanvasContainer";
