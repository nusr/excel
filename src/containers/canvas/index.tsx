import React, { memo, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "@/store";
import { EditorContainer } from "../EditorContainer";
import { getSingletonController } from "@/controller";
import { COL_TITLE_WIDTH, ROW_TITLE_HEIGHT, DOUBLE_CLICK_TIME } from "@/util";
import { CellPosition } from "@/types";
import { MOCK_MODEL } from "@/model";
import { Main } from "@/canvas";

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
    controller.updateSelection(position.row, position.col);
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
      controller.updateSelection(activeCell.row + 1, activeCell.col);
    },
    [activeCell]
  );
  const onInputTab = useCallback(
    (textValue: string) => {
      const controller = getSingletonController();
      controller.setCellValue(activeCell.row, activeCell.col, textValue);
      controller.updateSelection(activeCell.row, activeCell.col + 1);
    },
    [activeCell]
  );
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvasDom = canvasRef.current;
    const controller = getSingletonController();
    const draw = new Main(controller, canvasDom);
    console.log(draw);
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
    controller.on("change", (data) => {
      const { changeSet } = data;
      if (changeSet.includes("contentChange")) {
        const { sheetList, currentSheetId } = controller.model;
        dispatch({ type: "SET_SHEET_LIST", payload: sheetList });
        dispatch({ type: "SET_CURRENT_SHEET_ID", payload: currentSheetId });
      }
    });
    window.addEventListener("resize", handleWindowResize);
    canvasDom.addEventListener("mousedown", handleClick);
    return () => {
      getSingletonController.destroy();
      off();
      window.removeEventListener("resize", handleWindowResize);
      canvasDom.removeEventListener("mousedown", handleClick);
    };
  }, [dispatch, handleClick]);
  const onBlur = useCallback(() => {
    getSingletonController().quitEditing();
  }, []);
  return (
    <ContentContainer>
      <canvas ref={canvasRef} />
      <EditorContainer
        onInputEnter={onInputEnter}
        onInputTab={onInputTab}
        onBlur={onBlur}
      />
    </ContentContainer>
  );
});

CanvasContainer.displayName = "CanvasContainer";
