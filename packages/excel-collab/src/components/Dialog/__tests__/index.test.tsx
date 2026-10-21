import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Dialog } from '../index';

afterEach(cleanup);

describe('Dialog dismissal', () => {
  it('forwards Escape dismissal to its controlled state owner', async () => {
    const onOpenChange = vi.fn();
    render(
      <Dialog title="Settings" isOpen onOpenChange={onOpenChange}>
        Settings
      </Dialog>,
    );
    await userEvent.setup().keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('notifies cancellation and closes exactly once when Cancel is pressed', async () => {
    const onOpenChange = vi.fn();
    const onCancel = vi.fn();
    render(
      <Dialog title="Settings" isOpen onOpenChange={onOpenChange} onCancel={onCancel}>
        Settings
      </Dialog>,
    );
    await userEvent.setup().click(screen.getByTestId('dialog-cancel-button'));
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it.each([true, false])('preserves the confirmation result %s', async (accepted) => {
    const onOpenChange = vi.fn();
    const onOk = vi.fn(() => accepted);
    render(
      <Dialog title="Settings" isOpen onOpenChange={onOpenChange} onOk={onOk}>
        Settings
      </Dialog>,
    );
    await userEvent.setup().click(screen.getByTestId('dialog-confirm-button'));
    expect(onOk).toHaveBeenCalledTimes(1);
    if (accepted) {
      expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
    } else {
      expect(onOpenChange).not.toHaveBeenCalled();
    }
  });
});
