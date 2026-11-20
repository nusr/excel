import {
  Input,
  TextField as AriaTextField,
  TextArea as AriaTextArea,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from 'react-aria-components/TextField';
import { Label, FieldError, Description } from './Form';
import './TextField.css';
import type React from 'react';
import clsx from 'clsx';

type TextInputProps<T> = T extends HTMLTextAreaElement
  ? React.ComponentProps<typeof AriaTextArea>
  : React.ComponentProps<typeof Input>;

export interface TextFieldProps<T = HTMLInputElement> extends AriaTextFieldProps {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  placeholder?: string;
  inputRef?: React.Ref<T>;
  inputClassName?: string;
  inputProps?: TextInputProps<T> & {
    'data-testid'?: string;
    'data-role'?: string;
  };
}

export function TextField({
  label,
  description,
  errorMessage,
  placeholder,
  inputRef,
  inputClassName,
  inputProps,
  ...props
}: TextFieldProps) {
  return (
    <AriaTextField {...props}>
      {label && <Label>{label}</Label>}
      <Input
        {...inputProps}
        ref={inputRef}
        className={clsx('react-aria-Input inset', inputClassName, inputProps?.className)}
        placeholder={placeholder ?? inputProps?.placeholder}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}

export function TextArea({
  label,
  description,
  errorMessage,
  placeholder,
  inputRef,
  inputProps,
  inputClassName,
  ...props
}: TextFieldProps<HTMLTextAreaElement>) {
  return (
    <AriaTextField {...props}>
      {label && <Label>{label}</Label>}
      <AriaTextArea
        {...inputProps}
        ref={inputRef}
        className={clsx('react-aria-TextArea inset', inputClassName, inputProps?.className)}
        placeholder={placeholder ?? inputProps?.placeholder}
      />
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
