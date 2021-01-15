import React, { memo, useCallback, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { assert } from "@/util";
const commonStyle = css`
  height: 100%;
  width: 100%;
`;
const TextEditorWrapper = styled.div`
  ${commonStyle};
`;

const TextEditorContent = styled.input`
  ${commonStyle};
  padding: 0;
  margin: 0;
  border: none;
  background-color: unset;
  border-radius: unset;
  outline: none;
  font: inherit;
`;
export type CommonProps = {
  onInputEnter(value: string): void;
  onInputTab(value: string): void;
  onBlur(): void;
};
type TextEditorProps = {
  value: string | number;
  isCellEditing: boolean;
} & CommonProps;

export const TextEditor = memo((props: TextEditorProps) => {
  const { value = "", isCellEditing, onInputEnter, onInputTab, onBlur } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const dom = inputRef.current;
    if (dom) {
      dom.value = String(value);
      // dom.focus();
    }
  }, [isCellEditing, value]);
  const handleBlur = useCallback(() => {
    onBlur();
  }, [onBlur]);
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;
      const dom = inputRef.current;
      assert(dom !== null);
      const textValue = dom.value;
      if (key === "Enter") {
        onInputEnter(textValue);
        dom.value = "";
      } else if (key === "Tab") {
        onInputTab(textValue);
        dom.value = "";
      }
    },
    [onInputEnter, onInputTab]
  );
  return (
    <TextEditorWrapper>
      <TextEditorContent
        ref={inputRef}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    </TextEditorWrapper>
  );
});

TextEditor.displayName = "TextEditor";
