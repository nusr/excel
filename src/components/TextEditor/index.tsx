import React, { memo, useRef, useCallback } from "react";
import styled, { css } from "styled-components";
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
  className?: string;
  onInputEnter(event: React.KeyboardEvent<HTMLInputElement>): void;
  onInputTab(event: React.KeyboardEvent<HTMLInputElement>): void;
  onBlur(event: React.FocusEvent<HTMLInputElement>): void;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
};
type TextEditorProps = {
  value: string | number;
  isCellEditing: boolean;
} & CommonProps;

export const TextEditor = memo((props: TextEditorProps) => {
  const {
    value = "",
    className = "",
    // isCellEditing,
    onInputEnter,
    onInputTab,
    onBlur,
    onChange,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  // useEffect(() => {
  //   const dom = inputRef.current;
  //   if (isCellEditing) {
  //     dom.focus();
  //   }
  // }, [isCellEditing]);
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur(event);
    },
    [onBlur]
  );
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;
      if (key === "Enter") {
        onInputEnter(event);
      } else if (key === "Tab") {
        onInputTab(event);
      }
    },
    [onInputEnter, onInputTab]
  );
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event);
    },
    [onChange]
  );
  return (
    <TextEditorWrapper className={className}>
      <TextEditorContent
        ref={inputRef}
        value={value}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
      />
    </TextEditorWrapper>
  );
});

TextEditor.displayName = "TextEditor";
