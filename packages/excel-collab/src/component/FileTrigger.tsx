import {
  FileTrigger as AriaFileTrigger,
  type FileTriggerProps,
} from 'react-aria-components/FileTrigger';
import { forwardRef } from 'react';

export const FileTrigger = forwardRef<HTMLInputElement, FileTriggerProps>((props, ref) => (
  <AriaFileTrigger {...props} ref={ref} />
));

FileTrigger.displayName = 'FileTrigger';
