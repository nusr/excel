'use client';
import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
} from 'react-aria-components/Button';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import { ProgressCircle } from './ProgressCircle';
import './Button.css';
import { TooltipTrigger } from 'react-aria-components/Tooltip';
import { Tooltip } from './Tooltip';
import clsx from 'clsx';

interface ButtonProps extends Omit<RACButtonProps, 'aria-label'> {
  /**
   * The visual style of the button (Vanilla CSS implementation specific).
   *
   * @default 'secondary'
   */
  variant?: 'primary' | 'secondary' | 'quiet';
  'aria-label': string;
}

export function Button(props: ButtonProps) {
  return (
    <TooltipTrigger>
      <RACButton
        {...props}
        className={composeRenderProps(props.className, (className) =>
          clsx('react-aria-Button button-base', className),
        )}
        data-variant={props.variant || 'secondary'}
      >
        {composeRenderProps(props.children, (children, { isPending }) => (
          <>
            {!isPending && children}
            {isPending && (
              <ProgressCircle aria-label="Saving..." isIndeterminate />
            )}
          </>
        ))}
      </RACButton>
      <Tooltip>{props['aria-label']}</Tooltip>
    </TooltipTrigger>
  );
}
