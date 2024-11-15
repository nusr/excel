import { fireEvent, screen, waitFor } from '@testing-library/react';
import { isMac } from '@/util';
import './global.mock';
import { IController } from '@/types';
import { renderComponent } from './util';

const commandKey = `${isMac() ? 'meta' : 'ctrl'}Key`;

describe('shortcut.test.tsx', () => {
  let controller: IController;
  beforeEach(async () => {
    const r = renderComponent();
    controller = r.controller;
  });
  describe('Enter', () => {
    test('normal', async () => {
      fireEvent.keyDown(document.body, { key: 'Enter' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A2');
    });
  });
  describe('Tab', () => {
    test('normal', () => {
      fireEvent.click(screen.getByTestId('canvas-main'));
      fireEvent.keyDown(document.body, { key: 'Tab' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('B1');
    });
  });
  describe('ArrowDown', () => {
    test('meta', () => {
      expect(screen.getByTestId('canvas-bottom-bar')).not.toHaveClass('active');

      fireEvent.keyDown(document.body, {
        key: 'ArrowDown',
        [commandKey]: true,
      });
      expect(screen.getByTestId('canvas-bottom-bar')).toHaveClass('active');
    });
  });
  describe('ArrowUp', () => {
    test('normal', async () => {
      fireEvent.keyDown(document.body, { key: 'ArrowDown' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A2');
      fireEvent.keyDown(document.body, { key: 'ArrowUp' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });

    test('meta', () => {
      expect(screen.getByTestId('canvas-bottom-bar')).not.toHaveClass('active');

      fireEvent.keyDown(document.body, {
        key: 'ArrowDown',
        [commandKey]: true,
      });
      expect(screen.getByTestId('canvas-bottom-bar')).toHaveClass('active');

      fireEvent.keyDown(document.body, { key: 'ArrowUp', [commandKey]: true });
      expect(screen.getByTestId('canvas-bottom-bar')).not.toHaveClass('active');
    });
  });
  describe('ArrowRight', () => {
    test('normal', () => {
      fireEvent.keyDown(document.body, { key: 'ArrowRight' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('B1');
      fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });
    test('meta', () => {
      fireEvent.keyDown(document.body, {
        key: 'ArrowRight',
        [commandKey]: true,
      });
      expect(controller.getScroll().col).toBeGreaterThanOrEqual(10);
    });
  });
  describe('ArrowLeft', () => {
    test('meta', () => {
      fireEvent.keyDown(document.body, {
        key: 'ArrowRight',
        [commandKey]: true,
      });
      expect(controller.getScroll().col).toBeGreaterThanOrEqual(10);
      fireEvent.keyDown(document.body, {
        key: 'ArrowLeft',
        [commandKey]: true,
      });
      expect(controller.getScroll().col).toEqual(0);
    });
  });
  describe('bold', () => {
    test('normal', async () => {
      fireEvent.keyDown(document.body, { key: 'b', [commandKey]: true });
      await waitFor(() => {
        expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
          fontWeight: 'bold',
        });
      });
    });
    test('twice', async () => {
      fireEvent.keyDown(document.body, { key: 'b', [commandKey]: true });
      await waitFor(() => {
        expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
          fontWeight: 'bold',
        });
      });
      fireEvent.keyDown(document.body, { key: 'b', [commandKey]: true });
      await waitFor(() => {
        expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
          fontWeight: 'bold',
        });
      });
    });
  });
  describe('italic', () => {
    test('normal', () => {
      fireEvent.keyDown(document.body, { key: 'i', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontStyle: 'italic',
      });
    });
    test('twice', () => {
      fireEvent.keyDown(document.body, { key: 'i', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontStyle: 'italic',
      });
      fireEvent.keyDown(document.body, { key: 'i', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        fontStyle: 'italic',
      });
    });
  });
  describe('strike', () => {
    test('normal', () => {
      fireEvent.keyDown(document.body, { key: '5', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'line-through',
      });
    });
    test('twice', () => {
      fireEvent.keyDown(document.body, { key: '5', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'line-through',
      });
      fireEvent.keyDown(document.body, { key: '5', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        textDecorationLine: 'line-through',
      });
    });
  });
  describe('underline', () => {
    test('normal', () => {
      fireEvent.keyDown(document.body, { key: 'u', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('twice', () => {
      fireEvent.keyDown(document.body, { key: 'u', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
      fireEvent.keyDown(document.body, { key: 'u', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('strike', () => {
      fireEvent.keyDown(document.body, { key: 'u', [commandKey]: true });
      fireEvent.keyDown(document.body, { key: '5', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline line-through',
      });
    });
  });
  describe('copy', () => {
    test('normal', async () => {
      fireEvent.keyDown(document.body, { key: 'b', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });

      fireEvent.copy(document.body, { clipboardData: { setData: () => {} } });

      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.paste(document.body, { clipboardData: { getData: () => '' } });
      expect(await screen.findByTestId('formula-bar-name-input')).toHaveValue(
        'A2',
      );
      expect(
        controller.getCell(controller.getActiveRange().range)?.isBold,
      ).toEqual(true);
    });
  });
  describe('cut', () => {
    test('normal', async () => {
      fireEvent.keyDown(document.body, { key: 'b', [commandKey]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });

      fireEvent.cut(document.body, { clipboardData: { setData: () => {} } });

      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.paste(document.body, { clipboardData: { getData: () => '' } });
      expect(await screen.findByTestId('formula-bar-name-input')).toHaveValue(
        'A2',
      );
      expect(
        controller.getCell(controller.getActiveRange().range)?.isBold,
      ).toEqual(true);

      fireEvent.keyDown(document.body, { key: 'ArrowUp' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        fontWeight: 'bold',
      });
    });
  });

  describe('wheel', () => {
    test('scroll down', async () => {
      expect(
        window.getComputedStyle(
          screen.getByTestId('vertical-scroll-bar-content'),
        ).transform,
      ).toEqual('translateY(0px)');
      fireEvent.wheel(document.body, {
        deltaX: 0,
        deltaY: 200,
      });
      const transform = window.getComputedStyle(
        screen.getByTestId('vertical-scroll-bar-content'),
      ).transform;
      expect(transform).toEqual('translateY(22px)');
    });
    test(' scroll right', async () => {
      expect(
        window.getComputedStyle(
          screen.getByTestId('horizontal-scroll-bar-content'),
        ).transform,
      ).toEqual('translateX(0px)');
      fireEvent.wheel(document.body, {
        deltaX: 200,
        deltaY: 0,
      });
      const transform = window.getComputedStyle(
        screen.getByTestId('horizontal-scroll-bar-content'),
      ).transform;
      expect(transform).toEqual('translateX(208px)');
    });
  });

  describe('undo', () => {
    test('ok', async () => {
      expect(screen.getByTestId('toolbar-undo')).not.toBeDisabled();

      fireEvent.keyDown(document.body, { key: 'z', [commandKey]: true });
      expect(screen.getByTestId('toolbar-undo')).toBeDisabled();
    });
  });

  describe('redo', () => {
    test('ok', () => {
      fireEvent.click(screen.getByTestId('toolbar-bold'));
      expect(screen.getByTestId('toolbar-redo')).toBeDisabled();

      fireEvent.keyDown(document.body, { key: 'z', [commandKey]: true });
      expect(screen.getByTestId('toolbar-redo')).not.toBeDisabled();
      fireEvent.keyDown(document.body, { key: 'y', [commandKey]: true });
      expect(screen.getByTestId('toolbar-redo')).toBeDisabled();
      expect(screen.getByTestId('toolbar-undo')).not.toBeDisabled();
    });
  });
});
