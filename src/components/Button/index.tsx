import React, { memo } from "react";
import styled, { withTheme } from "styled-components";
import { classnames } from "@/util";
import noop from "lodash/noop";

const ButtonContainer = withTheme(styled.div`
  padding: 0 5px;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #5f5f5f;
  font-weight: bold;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-block;
  border-radius: 4px;
  border: 1px solid transparent;
  & + & {
    margin-left: 8px;
  }
  &.circle {
    border-radius: 50%;
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }
  &:hover,
  &.active {
    background-color: ${({ theme }) => theme.buttonActiveColor};
    border-color: #808080;
  }
`);
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
    <ButtonContainer
      onClick={onClick}
      style={style}
      className={classnames(className, {
        disabled,
        active,
        circle: type === "circle",
      })}
    >
      {children}
    </ButtonContainer>
  );
});

Button.displayName = "Button";
