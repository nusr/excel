import React, { useCallback } from "react";
import styled, { withTheme } from "styled-components";

const SelectContainer = styled.select``;
const SelectItem = withTheme(styled.option`
  font-size: ${(props) => props.theme.font};
`);

type ValueType = string | number;

type OptionItem = {
  value: ValueType;
  label: string;
};

type Props = {
  value?: ValueType;
  style?: React.CSSProperties;
  data: Array<ValueType | OptionItem>;
  onChange: (value: string) => void;
};

export const Select = React.memo((props: Props) => {
  const { data, value: activeValue, style = {}, onChange } = props;
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
        return (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        );
      })}
    </SelectContainer>
  );
});
Select.displayName = "Select";
