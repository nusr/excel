import React, { memo, useRef, useEffect, useCallback } from "react";
import { CellEditorContainer } from "./CellEditor";
import { Main, Controller } from "@/canvas";
import { Interaction } from "@/interaction";
import { useController } from "@/store";

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
    <div className="relative">
      <canvas className="full" ref={canvasRef} onContextMenu={onContextMenu} />
      <CellEditorContainer />
    </div>
  );
});

CanvasContainer.displayName = "CanvasContainer";
