import { useEffect, h, Component } from '@/react';
// import { CellEditorContainer } from './CellEditor';
import { Main, Controller as RenderController } from '@/canvas';
import { Interaction } from '@/interaction';
import { Controller } from '@/controller';
const canvasId = 'main-canvas';

export const CanvasContainer: Component = () => {
  // const controller = useController();
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const ref = useRef<IEditorHandler>({
  // focus: () => 0,
  // });
  useEffect(() => {
    const canvasDom = document.querySelector<HTMLCanvasElement>(
      '#' + canvasId,
    )!;
    const controller = new Controller();
    const renderController = new RenderController(canvasDom);
    controller.setRenderController(renderController);
    new Main(controller, canvasDom);
    const interaction = new Interaction(controller, canvasDom);
    controller.setHooks({
      focus: canvasDom.focus,
      blur: () => {
        // Cell Editor or Formula Bar Editor
        const dom = document.activeElement;
        if (dom && dom.tagName === 'INPUT') {
          (dom as HTMLInputElement).blur();
        }
      },
    });
    return () => {
      interaction.removeEvents();
    };
  }, []);

  // const onContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    // event.stopPropagation();
    // event.preventDefault();
  // };
  return h(
    'div',
    {
      className: 'relative canvas-container',
    },
    h('canvas', {
      className: 'full',
      id: canvasId,
    }),
  );
};
