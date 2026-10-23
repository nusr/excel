import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Input } from 'react-aria-components/Input';
import { Button } from '../Button';
import { ColorSwatch } from '../ColorSwatch';
import { CommandPalette } from '../CommandPalette';
import { Dialog, DialogTrigger } from '../Dialog';
import { InputGroup } from '../InputGroup';
import { NumberField } from '../NumberField';
import { Popover } from '../Popover';
import { ProgressCircle } from '../ProgressCircle';
import { Select, SelectItem } from '../Select';
import { Heading, Sheet } from '../Sheet';

afterEach(cleanup);

describe('component prop and interaction regressions', () => {
  it.each([16, 32])('uses numeric SVG geometry for a %spx progress circle', (size) => {
    const { container } = render(<ProgressCircle aria-label="Loading" value={50} size={size} />);
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toHaveStyle({
      width: `${size}px`,
      height: `${size}px`,
    });
    const circles = container.querySelectorAll('circle');
    expect(circles).toHaveLength(2);
    for (const circle of circles) {
      expect(circle).toHaveAttribute('r', '14');
      expect(circle).toHaveAttribute('cx', '16');
      expect(circle).toHaveAttribute('cy', '16');
    }
    expect(circles[1]).toHaveAttribute('stroke-dashoffset', '50');
  });

  it('preserves indeterminate progress animation with valid SVG geometry', () => {
    const { container } = render(<ProgressCircle aria-label="Loading" isIndeterminate />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
    expect(container.querySelector('circle:last-child')).toHaveAttribute('stroke-dashoffset', '75');
    expect(container.querySelector('animateTransform')).toHaveAttribute(
      'repeatCount',
      'indefinite',
    );
  });

  it('honors controlled Sheet visibility and dismissal', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Sheet isOpen={false} onOpenChange={onOpenChange}>
        <Heading slot="title">Settings</Heading>
      </Sheet>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(
      <Sheet isOpen onOpenChange={onOpenChange} className={() => 'settings-sheet'}>
        <Heading slot="title">Settings</Heading>
      </Sheet>,
    );
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getByRole('dialog').closest('.sheet-overlay')).toHaveClass('settings-sheet');
    await userEvent.setup().keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('does not intercept Escape when the command palette is closed', () => {
    const onOpenChange = vi.fn();
    render(<CommandPalette isOpen={false} onOpenChange={onOpenChange} />);
    expect(fireEvent.keyDown(document, { key: 'Escape' })).toBe(true);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('names the command dialog and lets the open modal handle Escape', async () => {
    const onOpenChange = vi.fn();
    render(<CommandPalette isOpen onOpenChange={onOpenChange} aria-label="Actions" />);
    expect(screen.getByRole('dialog', { name: 'Actions' })).toBeInTheDocument();
    await userEvent.setup().keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('respects an already handled command shortcut and removes its listener', () => {
    const onOpenChange = vi.fn();
    const { unmount } = render(<CommandPalette isOpen={false} onOpenChange={onOpenChange} />);
    const event = new KeyboardEvent('keydown', {
      key: 'j',
      ctrlKey: true,
      metaKey: true,
      cancelable: true,
    });
    event.preventDefault();
    document.dispatchEvent(event);
    expect(onOpenChange).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'j', ctrlKey: true, metaKey: true });
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    unmount();
    fireEvent.keyDown(document, { key: 'j', ctrlKey: true, metaKey: true });
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('does not give an aria-labeled InputGroup a dangling label reference', () => {
    render(
      <InputGroup aria-label="Coordinates">
        <Input aria-label="Column" />
      </InputGroup>,
    );
    expect(screen.getByRole('group', { name: 'Coordinates' })).not.toHaveAttribute(
      'aria-labelledby',
    );
  });

  it('preserves external labels on an InputGroup', () => {
    render(
      <>
        <span id="coordinates">Coordinates</span>
        <InputGroup aria-labelledby="coordinates">
          <Input aria-label="Column" />
        </InputGroup>
      </>,
    );
    expect(screen.getByRole('group', { name: 'Coordinates' })).toHaveAttribute(
      'aria-labelledby',
      'coordinates',
    );
  });

  it('continues to name an InputGroup from its visible label', () => {
    render(
      <InputGroup label="Coordinates">
        <Input aria-label="Column" />
      </InputGroup>,
    );
    expect(screen.getByRole('group', { name: 'Coordinates' })).toBeInTheDocument();
  });

  it('passes NumberField placeholders to its input', () => {
    render(<NumberField label="Rows" placeholder="Enter row count" />);
    expect(screen.getByPlaceholderText('Enter row count')).toBeInTheDocument();
  });

  it('uses option labels, not opaque IDs, for Select keyboard typeahead', async () => {
    const onChange = vi.fn();
    render(
      <Select label="Fruit" onChange={onChange} defaultValue="1">
        <SelectItem id="1">Apple</SelectItem>
        <SelectItem id="2">Banana</SelectItem>
      </Select>,
    );
    await userEvent.setup().tab();
    await userEvent.setup().keyboard('b');
    expect(onChange).toHaveBeenCalledWith('2');
  });

  it.each(['string', 'function'] as const)('preserves %s Button class names', (kind) => {
    render(
      <Button
        aria-label="Save"
        className={kind === 'string' ? 'save-action' : () => 'save-action'}
      />,
    );
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
      'react-aria-Button',
      'button-base',
      'save-action',
    );
  });

  it.each(['object', 'function'] as const)('preserves %s ColorSwatch styles', (kind) => {
    render(
      <ColorSwatch
        color="#ff0000"
        aria-label="Red"
        style={kind === 'object' ? { opacity: 0.25 } : () => ({ opacity: 0.25 })}
      />,
    );
    expect(screen.getByRole('img', { name: /Red/ })).toHaveStyle({
      opacity: '0.25',
    });
  });

  it('evaluates Popover className render props', async () => {
    render(
      <DialogTrigger>
        <Button aria-label="Details" />
        <Popover className={() => 'details-popover'}>
          <Dialog aria-label="Details">Details</Dialog>
        </Popover>
      </DialogTrigger>,
    );
    await userEvent.setup().click(screen.getByRole('button', { name: 'Details' }));
    expect(screen.getByRole('dialog').closest('.react-aria-Popover')).toHaveClass(
      'react-aria-Popover',
      'details-popover',
    );
  });
});
