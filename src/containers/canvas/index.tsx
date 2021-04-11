import React, { memo, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { CellEditorContainer } from "./CellEditor";
import { Main, Controller } from "@/canvas";
import { Interaction } from "@/interaction";
import { useController } from "@/store";

const ContentContainer = styled.div`
  position: relative;
`;

const CanvasElement = styled.canvas`
  width: 100%;
  height: 100%;
`;

export const CanvasContainer = memo(() => {
  const controller = useController();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvasDom = canvasRef.current;
    const renderController = new Controller(canvasDom);
    controller.setRenderController(renderController);
    new Main(controller, canvasDom);
    const interaction = new Interaction(controller, canvasDom);
    return () => {
      interaction.removeEvents();
    };
  }, [controller]);

  const onContextMenu = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      event.stopPropagation();
      event.preventDefault();
    },
    []
  );

  return (
    <ContentContainer>
      <CanvasElement ref={canvasRef} onContextMenu={onContextMenu} />
      <CellEditorContainer />
    </ContentContainer>
  );
});

CanvasContainer.displayName = "CanvasContainer";
