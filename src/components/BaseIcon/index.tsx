import React, { memo } from "react";
import { classnames } from "@/util";
export type BaseIconName =
  | "alignCenter"
  | "alignLeft"
  | "alignRight"
  | "bold"
  | "fillColor"
  | "fontColor"
  | "italic"
  | "middleAlign"
  | "plus"
  | "redo"
  | "underline"
  | "undo";

type BaseIconProps = {
  className?: string;
  name: BaseIconName;
};
export const BaseIcon = memo((props: BaseIconProps) => {
  const { className = "", name } = props;
  return (
    <svg className={classnames("icon-wrapper", className)} aria-hidden="true">
      <use xlinkHref={`#icon-${name}`}></use>
    </svg>
  );
});

BaseIcon.displayName = "BaseIcon";
