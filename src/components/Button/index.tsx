import React, { memo } from "react";
import styled from "styled-components";
import classnames from "classnames";

const ButtonContainer = styled.div`
  padding: 0 5px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #5f5f5f;
  font-weight: bold;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-block;
  background-color: #fff;
  & + & {
    margin-left: 8px;
  }
  &.disabled {
    cursor: not-allowed;
    opacity: 0.35;
  }
  &:hover,
  &.active {
    background-color: #c6c6c6;
    border: 1px solid #808080;
  }
`;
type ButtonProps = {
  active?: boolean;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export const Button: React.FunctionComponent<ButtonProps> = memo((props) => {
  const {
    children,
    style = {},
    className = "",
    onClick,
    disabled = false,
    active = false,
  } = props;
  return (
    <ButtonContainer
      onClick={onClick}
      style={style}
      className={classnames(className, {
        disabled,
        active,
      })}
    >
      {children}
    </ButtonContainer>
  );
});

Button.displayName = "Button";
