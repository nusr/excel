import React, { useCallback, useState } from "react";
type Props = {
  color: string;
  style?: React.CSSProperties;
  onChange: (value: string) => void;
};
export const COLOR_LIST = [
  "#4D4D4D",
  "#999999",
  "#FFFFFF",
  "#F44E3B",
  "#FE9200",
  "#FCDC00",
  "#DBDF00",
  "#A4DD00",
  "#68CCCA",
  "#73D8FF",
  "#AEA1FF",
  "#FDA1FF",
  "#333333",
  "#808080",
  "#cccccc",
  "#D33115",
  "#E27300",
  "#FCC400",
  "#B0BC00",
  "#68BC00",
  "#16A5A5",
  "#009CE0",
  "#7B64FF",
  "#FA28FF",
  "#000000",
  "#666666",
  "#B3B3B3",
  "#9F0500",
  "#C45100",
  "#FB9E00",
  "#808900",
  "#194D33",
  "#0C797D",
  "#0062B1",
  "#653294",
  "#AB149E",
];

export const ColorPicker: React.FunctionComponent<React.PropsWithChildren<Props>> = React.memo(
  (props) => {
    const { color, style = {}, children, onChange } = props;
    const [visible, setVisible] = useState(false);
    const toggleColorPicker = useCallback(() => {
      setVisible((v) => !v);
    }, []);
    const handleBlur = useCallback(() => {
      setVisible(false);
    }, []);

    return (
      <div className="relative" onBlur={handleBlur} style={style}>
        <div
          className="color-picker-trigger"
          style={{ color }}
          onClick={toggleColorPicker}
        >
          {children}
        </div>
        {visible ? (
          <div className="color-picker-wrapper">
            <div className="color-picker-list">
              {COLOR_LIST.map((item) => (
                <div
                  className="color-picker-item"
                  style={{ backgroundColor: item }}
                  key={item}
                  onClick={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                ></div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
);

ColorPicker.displayName = "ColorPicker";
