import { h} from "@/react";
import { Button, ButtonProps } from "@/components";
import { useFontFamily } from "@/hooks";

const colorPickerStyle = { marginLeft: 8 };

export const ToolbarContainer = () => {
  // const [fontFamilyList] = useFontFamily();
  // const controller = useController();
  // const { activeCell, canRedo, canUndo } = useSelector([
    // "activeCell",
    // "canRedo",
    // "canUndo",
  // ]);
  // const { style = {} } = activeCell;
  // const {
    // isBold,
    // isItalic,
    // fontSize = DEFAULT_FONT_SIZE,
    // fontColor = DEFAULT_FONT_COLOR,
    // fillColor,
    // fontFamily,
    // wrapText,
  // } = style;
  // const setCellStyle = useCallback(
    // (value: Partial<StyleType>) => {
      // controller.setCellStyle(value);
    // },
    // [controller]
  // );
  // const handleFontSize = 
    // (value: string) => {
      // if (isNumber(value)) {
        // const realValue = parseFloat(value);
        // setCellStyle({ fontSize: realValue });
      // }
    // },
    // [setCellStyle]
  // );
  // const getItemStyle = useCallback((value: string | number): React.CSSProperties => {
    // return { fontFamily: String(value) };
  // }, []);
  return    h(
    'div',
    {
      className: 'toolbar-wrapper',
    },
    h<ButtonProps>(Button, {
      icon: 'undo',
    }),
    h<ButtonProps>(Button, {
      icon: 'redo',
    }),
    h<ButtonProps>(Button, {
      icon: 'bold',
    }),
    h<ButtonProps>(Button, {
      icon: 'italic',
    }),
    h<ButtonProps>(Button, {
      children: ['Wrap Text'],
    }),
  );
  // return (
    // <div className="toolbar-wrapper" id="tool-bar-container">
      {/* <Button disabled={!canUndo} onClick={controller.undo}> */}
        {/* <BaseIcon name="undo" /> */}
      {/* </Button> */}
      {/* <Button disabled={!canRedo} onClick={controller.redo}> */}
        {/* <BaseIcon name="redo" /> */}
      {/* </Button> */}
      {/* <Button active={isBold} onClick={() => setCellStyle({ isBold: !isBold })}> */}
        {/* <BaseIcon name="bold" /> */}
      {/* </Button> */}
      {/* <Button */}
        // active={isItalic}
        // onClick={() => setCellStyle({ isItalic: !isItalic })}
      // >
        {/* <BaseIcon name="italic" /> */}
      {/* </Button> */}
      {/* <Button */}
        // active={wrapText === EWrap.AUTO_WRAP}
        // onClick={() => setCellStyle({ wrapText: EWrap.AUTO_WRAP })}
      // >
        {/* Wrap Text */}
      {/* </Button> */}
      {/* <Select */}
        // data={fontFamilyList}
        // style={colorPickerStyle}
        // value={fontFamily || DEFAULT_FONT_FAMILY}
        // onChange={(item) => setCellStyle({ fontFamily: item })}
        // getItemStyle={getItemStyle}
      // />
      {/* <Select */}
        // data={FONT_SIZE_LIST}
        // value={fontSize}
        // style={colorPickerStyle}
        // onChange={handleFontSize}
      // />
      {/* <ColorPicker */}
        // color={fontColor}
        // style={colorPickerStyle}
        // onChange={(color) => setCellStyle({ fontColor: color })}
      // >
        {/* <BaseIcon name="fontColor" /> */}
      {/* </ColorPicker> */}
      {/* <ColorPicker */}
        // color={fillColor || ""}
        // style={colorPickerStyle}
        // onChange={(color) => setCellStyle({ fillColor: color })}
      // >
        {/* <BaseIcon name="fillColor" /> */}
      {/* </ColorPicker> */}
      {/* <Github /> */}
    {/* </div> */}
  // );
}

