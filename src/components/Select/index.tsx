import React, { useCallback } from "react";
import styled, { withTheme } from "styled-components";
import { classnames } from "@/util";

const SelectContainer = styled.select``;
const SelectItem = withTheme(styled.option`
  font-size: ${(props) => props.theme.font};
  cursor: pointer;
  &.disabled {
    background-color: #fff;
    cursor: not-allowed;
    color: ${(props) => props.theme.disabledColor};
    &:hover {
      background-color: #fff;
    }
  }
`);

type ValueType = string | number;

export type OptionItem = {
  value: ValueType;
  label: string;
  disabled?: boolean;
};

type Props = {
  value?: ValueType;
  style?: React.CSSProperties;
  data: Array<ValueType | OptionItem>;
  getItemStyle?: (value: ValueType) => React.CSSProperties;
  onChange: (value: string) => void;
};

export const Select = React.memo((props: Props) => {
  const {
    data,
    value: activeValue,
    style = {},
    onChange,
    getItemStyle = () => ({}),
  } = props;
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      onChange(value);
    },
    [onChange]
  );
  return (
    <SelectContainer onChange={handleChange} value={activeValue} style={style}>
      {data.map((item) => {
        const value = typeof item === "object" ? item.value : item;
        const label = typeof item === "object" ? item.label : item;
        const disabled = typeof item === "object" ? item.disabled : false;
        const itemStyle = getItemStyle(value);
        return (
          <SelectItem
            key={value}
            value={value}
            style={itemStyle}
            className={classnames({ disabled })}
          >
            {label}
          </SelectItem>
        );
      })}
    </SelectContainer>
  );
});
Select.displayName = "Select";
