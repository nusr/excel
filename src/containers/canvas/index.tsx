import React, { memo, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "@/store";
import { EditorContainer } from "../EditorContainer";
import { getSingletonController } from "@/controller";
import { COL_TITLE_WIDTH, ROW_TITLE_HEIGHT, DOUBLE_CLICK_TIME } from "@/util";
import { CellPosition } from "@/types";
import { MOCK_MODEL } from "@/model";

const ContentContainer = styled.div`
  position: relative;
`;

type StateValue = {
  position: CellPosition;
  timeStamp: number;
  isCellEditing: boolean;
};

export const CanvasContainer = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef<StateValue>({
    position: { row: 0, col: 0 },
    timeStamp: 0,
    isCellEditing: false,
  });
  const { isCellEditing, activeCell } = useSelector([
    "isCellEditing",
    "activeCell",
  ]);
  state.current.isCellEditing = isCellEditing;
  const dispatch = useDispatch();
  const handleClick = useCallback((event) => {
    console.log("handleClick");
    console.log(event);
    const { timeStamp, offsetX, offsetY } = event;
    const controller = getSingletonController();
    if (offsetX < COL_TITLE_WIDTH && offsetY < ROW_TITLE_HEIGHT) {
      controller.selectAll();
      return;
    }
    if (offsetX < COL_TITLE_WIDTH) {
      controller.selectRow();
      return;
    }
    if (offsetY < ROW_TITLE_HEIGHT) {
      controller.selectCol();
      return;
    }
    const position = controller.clickPositionToCell(offsetX, offsetY);
    controller.setActiveCell(position.row, position.col);
    const delay = timeStamp - state.current.timeStamp;
    if (delay < DOUBLE_CLICK_TIME) {
      controller.enterEditing();
    }
    state.current.timeStamp = timeStamp;
    state.current.position = position;
  }, []);
  const onInputEnter = useCallback(
    (textValue: string) => {
      const controller = getSingletonController();
      controller.setCellValue(activeCell.row, activeCell.col, textValue);
      controller.setActiveCell(activeCell.row + 1, activeCell.col);
    },
    [activeCell]
  );
  const onInputTab = useCallback(
    (textValue: string) => {
      const controller = getSingletonController();
      controller.setCellValue(activeCell.row, activeCell.col, textValue);
      controller.setActiveCell(activeCell.row, activeCell.col + 1);
    },
    [activeCell]
  );
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvasDom = canvasRef.current;
    const controller = getSingletonController(canvasDom);
    const off = controller.on("dispatch", (data) => {
      console.log("on dispatch", data);
      dispatch(data);
    });
    dispatch({
      type: "INIT_CONTROLLER",
    });
    controller.loadJSON(MOCK_MODEL);
    function handleWindowResize() {
      controller.windowResize();
    }
    window.addEventListener("resize", handleWindowResize);
    canvasDom.addEventListener("mousedown", handleClick);
    return () => {
      getSingletonController.destroy();
      off();
      window.removeEventListener("resize", handleWindowResize);
      canvasDom.removeEventListener("mousedown", handleClick);
    };
  }, [dispatch, handleClick]);
  return (
    <ContentContainer>
      <canvas ref={canvasRef} />
      <EditorContainer onInputEnter={onInputEnter} onInputTab={onInputTab} />
    </ContentContainer>
  );
});

CanvasContainer.displayName = "CanvasContainer";
