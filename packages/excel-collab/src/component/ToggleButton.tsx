'use client';
import { composeRenderProps } from 'react-aria-components/composeRenderProps';
import {
  ToggleButton as RACToggleButton,
  type ToggleButtonProps as RACToggleButtonProps,
} from 'react-aria-components/ToggleButton';
import './ToggleButton.css';
import { TooltipTrigger } from 'react-aria-components/Tooltip';
import { Tooltip } from './Tooltip';
import clsx from 'clsx';

interface ToggleButtonProps extends Omit<RACToggleButtonProps, 'aria-label'> {
  /**
   * The visual style of the button (Vanilla CSS implementation specific).
   *
   * @default 'secondary'
   */
  variant?: 'primary' | 'secondary' | 'quiet';
  'aria-label': string;
}

export function ToggleButton(props: ToggleButtonProps) {
  return (
    <TooltipTrigger>
      <RACToggleButton
        {...props}
        className={composeRenderProps(props.className, (className) =>
          clsx('react-aria-ToggleButton button-base', className),
        )}
        data-variant={props.variant || 'secondary'}
      >
        {composeRenderProps(props.children, (children) => (
          <span>{children}</span>
        ))}
      </RACToggleButton>
      <Tooltip>{props['aria-label']}</Tooltip>
    </TooltipTrigger>
  );
}
