import React, { memo, useRef, useEffect, useCallback } from "react";
import { CellEditorContainer } from "./CellEditor";
import { Main, Controller } from "@/canvas";
import { Interaction } from "@/interaction";
import { useController } from "@/store";

type IEditorHandler = {
  focus: () => void;
};

export const CanvasContainer = memo(() => {
  const controller = useController();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ref = useRef<IEditorHandler>({
    focus: () => 0,
  });
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const canvasDom = canvasRef.current;
    const renderController = new Controller(canvasDom);
    controller.setRenderController(renderController);
    new Main(controller, canvasDom);
    const interaction = new Interaction(controller, canvasDom);
    controller.setHooks({
      focus: ref.current.focus,
      blur: () => {
        // Cell Editor or Formula Bar Editor
        const dom = document.activeElement;
        if (dom && dom.tagName === "INPUT") {
          (dom as HTMLInputElement).blur();
        }
      },
    });
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
    <div className="relative canvas-container" id="main-canvas">
      <canvas className="full" ref={canvasRef} onContextMenu={onContextMenu} />
      <CellEditorContainer ref={ref} />
    </div>
  );
});

CanvasContainer.displayName = "CanvasContainer";
