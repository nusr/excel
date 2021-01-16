import React, { memo } from "react";
import styled from "styled-components";

export type BaseIconName = "bold" | "italic" | "underline";

const SvgContainer = styled.svg`
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
`;

type BaseIconProps = {
  className?: string;
  name: BaseIconName;
};
export const BaseIcon = memo((props: BaseIconProps) => {
  const { className = "", name } = props;
  return (
    <SvgContainer className={className} aria-hidden="true">
      <use xlinkHref={`#icon-${name}`}></use>
    </SvgContainer>
  );
});

BaseIcon.displayName = "BaseIcon";
