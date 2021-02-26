import React, { memo, useRef, useEffect } from "react";
import { CellEditor } from "../CellEditor";
import { controller } from "@/controller";
import { Main } from "@/canvas";
import { Interaction } from "@/interaction";

// const ContentContainer = styled.div`
/* position: relative; */
// `;

export const CanvasContainer = memo(() => {
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
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} />
      <CellEditor />
    </div>
  );
});

CanvasContainer.displayName = "CanvasContainer";
