import React, { useCallback, useState } from "react";
import styled from "styled-components";
type Props = {
  color: string;
  style?: React.CSSProperties;
  onChange: (value: string) => void;
};
const Container = styled.div`
  position: relative;
`;
const Content = styled.div<{ color: string }>`
  color: ${(props) => props.color};
  border: 1px solid #ccc;
  padding: 2px 10px;
`;

const ColorPickerContainer = styled.div`
  width: 228px;
  position: absolute;
  z-index: 1;
  top: 22px;
  left: 0;
`;

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: 1px solid #ccc;
  padding-top: 5px;
  padding-left: 5px;
  background-color: #fff;
`;
const Item = styled.div<{ color: string }>`
  background-color: ${(props) => props.color};
  width: 15px;
  height: 15px;
  margin-bottom: 5px;
  margin-right: 5px;
  cursor: pointer;
  border: 1px solid transparent;
  &:hover {
    border-color: #ccc;
  }
`;

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

export const ColorPicker: React.FunctionComponent<Props> = React.memo(
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
      <Container onBlur={handleBlur} style={style}>
        <Content color={color} onClick={toggleColorPicker}>
          {children}
        </Content>
        {visible ? (
          <ColorPickerContainer>
            <List>
              {COLOR_LIST.map((item) => (
                <Item
                  color={item}
                  key={item}
                  onClick={() => {
                    onChange(item);
                    setVisible(false);
                  }}
                ></Item>
              ))}
            </List>
          </ColorPickerContainer>
        ) : null}
      </Container>
    );
  }
);

ColorPicker.displayName = "ColorPicker";
