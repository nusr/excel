import React, { memo, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "@/store";
import { EditorContainer } from "../EditorContainer";
import { MOCK_MODEL, getSingletonController } from "@/controller";
import {
  COL_TITLE_WIDTH,
  ROW_TITLE_HEIGHT,
  eventEmitter,
  DOUBLE_CLICK_TIME,
  DISPATCH_ACTION,
} from "@/util";
import { CellPosition, Action, IController } from "@/types";

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
      controller.selectRow(offsetX, offsetY);
      return;
    }
    if (offsetY < ROW_TITLE_HEIGHT) {
      controller.selectCol(offsetX, offsetY);
      return;
    }
    const position = controller.clickPositionToCell(offsetX, offsetY);
    controller.changeActiveCell(position.row, position.col);
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
      controller.changeActiveCell(activeCell.row + 1, activeCell.col);
    },
    [activeCell]
  );
  const onInputTab = useCallback(
    (textValue: string) => {
      const controller = getSingletonController();
      controller.setCellValue(activeCell.row, activeCell.col, textValue);
      controller.changeActiveCell(activeCell.row, activeCell.col + 1);
    },
    [activeCell]
  );
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvasDom = canvasRef.current;
    const off = eventEmitter.on(DISPATCH_ACTION, (data: Action) => {
      console.log("on dispatch", data);
      dispatch(data);
    });
    const controller: IController = getSingletonController(canvasDom);
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
