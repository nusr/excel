import '@testing-library/jest-dom';
import { App } from '@/containers';
import { initController } from '@/controller';
import * as React from 'react';
import {
  cleanup,
  render,
  fireEvent,
  act,
  screen,
  waitFor,
} from '@testing-library/react';
import { isMac } from '@/util';

describe('shortcut.test.tsx', () => {
  afterEach(cleanup);
  describe('Enter', () => {
    test('normal', async () => {
      render(<App controller={initController()} />);
      fireEvent.keyDown(document.body, { key: 'Enter' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A2');
    });
  });
  describe('Tab', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.click(screen.getByTestId('canvas-main'));
      fireEvent.keyDown(document.body, { key: 'Tab' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('B1');
    });
  });
  describe('ArrowDown', () => {
    test('meta', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'ArrowDown', [key]: true });
      expect(screen.getByTestId('canvas-bottom-bar')).toHaveStyle({
        display: 'block',
      });
    });
  });
  describe('ArrowUp', () => {
    test('normal', async () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.keyDown(document.body, { key: 'ArrowDown' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A2');
      fireEvent.keyDown(document.body, { key: 'ArrowUp' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });
  });
  describe('ArrowRight', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      fireEvent.keyDown(document.body, { key: 'ArrowRight' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('B1');
      fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
    });
  });
  describe('bold', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'b', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });
    });
    test('twice', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'b', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });
      fireEvent.keyDown(document.body, { key: 'b', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        fontWeight: 'bold',
      });
    });
  });
  describe('italic', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'i', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontStyle: 'italic',
      });
    });
    test('twice', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'i', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontStyle: 'italic',
      });
      fireEvent.keyDown(document.body, { key: 'i', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        fontStyle: 'italic',
      });
    });
  });
  describe('strike', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: '5', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'line-through',
      });
    });
    test('twice', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: '5', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'line-through',
      });
      fireEvent.keyDown(document.body, { key: '5', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        textDecorationLine: 'line-through',
      });
    });
  });
  describe('underline', () => {
    test('normal', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'u', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('twice', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'u', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline',
      });
      fireEvent.keyDown(document.body, { key: 'u', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        textDecorationLine: 'underline',
      });
    });
    test('strike', () => {
      act(() => {
        render(<App controller={initController()} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'u', [key]: true });
      fireEvent.keyDown(document.body, { key: '5', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        textDecorationLine: 'underline line-through',
      });
    });
  });
  describe('copy', () => {
    test('normal', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'b', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });

      fireEvent.copy(document.body, { clipboardData: { setData: () => {} } });

      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.paste(document.body, { clipboardData: { getData: () => '' } });
      await waitFor(() => {
        expect(controller.getCell(controller.getActiveCell())).toEqual({
          style: { isBold: true },
          row: 1,
          col: 0,
        });
        expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A2');
      });
    });
  });
  describe('cut', () => {
    test('normal', async () => {
      const controller = initController();
      act(() => {
        render(<App controller={controller} />);
      });
      const key = `${isMac() ? 'meta' : 'ctrl'}Key`;
      fireEvent.keyDown(document.body, { key: 'b', [key]: true });
      expect(screen.getByTestId('formula-editor-trigger')).toHaveStyle({
        fontWeight: 'bold',
      });

      fireEvent.cut(document.body, { clipboardData: { setData: () => {} } });

      fireEvent.keyDown(document.body, { key: 'Enter' });
      fireEvent.paste(document.body, { clipboardData: { getData: () => '' } });
      await waitFor(() => {
        expect(controller.getCell(controller.getActiveCell())).toEqual({
          style: { isBold: true },
          row: 1,
          col: 0,
        });
        expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A2');
      });

      fireEvent.keyDown(document.body, { key: 'ArrowUp' });
      expect(screen.getByTestId('formula-bar-name-input')).toHaveValue('A1');
      expect(screen.getByTestId('formula-editor-trigger')).not.toHaveStyle({
        fontWeight: 'bold',
      });
    });
  });
});
