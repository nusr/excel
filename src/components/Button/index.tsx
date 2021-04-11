import React, { memo } from "react";
import { classnames } from "@/util";
import { noop } from "@/lodash";

type ButtonProps = {
  type?: "normal" | "circle";
  active?: boolean;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const Button: React.FunctionComponent<ButtonProps> = memo((props) => {
  const {
    children,
    style = {},
    className = "",
    onClick = noop,
    disabled = false,
    active = false,
    type = "normal",
  } = props;
  return (
    <div
      onClick={onClick}
      style={style}
      className={classnames("button-wrapper", className, {
        disabled,
        active,
        circle: type === "circle",
      })}
    >
      {children}
    </div>
  );
});

Button.displayName = "Button";
