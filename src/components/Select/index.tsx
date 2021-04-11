import React, { useCallback } from "react";
import { classnames } from "@/util";

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
    <select onChange={handleChange} value={activeValue} style={style}>
      {data.map((item) => {
        const value = typeof item === "object" ? item.value : item;
        const label = typeof item === "object" ? item.label : item;
        const disabled = typeof item === "object" ? item.disabled : false;
        const itemStyle = getItemStyle(value);
        return (
          <option
            key={value}
            value={value}
            style={itemStyle}
            className={classnames("select-item", { disabled })}
          >
            {label}
          </option>
        );
      })}
    </select>
  );
});
Select.displayName = "Select";
