import React, { memo, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDispatch } from "@/store";
import { EditorContainer } from "@/containers/EditorContainer";
import { IController, Controller, MOCK_MODEL } from "@/controller";
import { COL_TITLE_WIDTH, ROW_TITLE_HEIGHT } from "@/util";
import { CellPosition } from "@/types";
import { useControllerState } from "@/store";
import { assert, DOUBLE_CLICK_TIME } from "@/util";

const ContentContainer = styled.div`
  position: relative;
`;

type StateValue = {
  controller: IController | null;
  position: CellPosition;
  timeStamp: number;
  isCellEditing: boolean;
};

export const CanvasContainer = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef<StateValue>({
    controller: null,
    position: { row: 0, col: 0 },
    timeStamp: 0,
    isCellEditing: false,
  });
  const { isCellEditing, activeCell } = useControllerState([
    "isCellEditing",
    "activeCell",
  ]);
  state.current.isCellEditing = isCellEditing;
  const dispatch = useDispatch();
  const handleClick = useCallback((event) => {
    console.log("handleClick");
    console.log(event);
    const { timeStamp, offsetX, offsetY } = event;
    const controller = state.current.controller;
    assert(controller !== null);
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
    console.log(position);
    controller.changeActiveCell(position.row, position.col);
    const delay = timeStamp - state.current.timeStamp;
    console.log(state.current.position, delay);
    if (delay < DOUBLE_CLICK_TIME) {
      controller.enterEditing();
    }
    state.current.timeStamp = timeStamp;
    state.current.position = position;
  }, []);
  const onInputEnter = useCallback(
    (textValue: string) => {
      const controller = state.current.controller;
      assert(controller !== null);
      controller.setCellValue(activeCell.row, activeCell.col, textValue);
      controller.changeActiveCell(activeCell.row + 1, activeCell.col);
    },
    [activeCell]
  );
  const onInputTab = useCallback(
    (textValue: string) => {
      const controller = state.current.controller;
      assert(controller !== null);
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
    assert(state.current.controller === null, "can't create Controller again");
    const controller: IController = new Controller(canvasDom, dispatch);
    state.current.controller = controller;
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
