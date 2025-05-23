import { Dialog, info } from '../Dialog';
import { cleanup, render, act, screen } from '@testing-library/react';

describe('Dialog.test.ts', () => {
  afterEach(cleanup);
  test('normal', () => {
    render(
      <Dialog visible title="test" getContainer={() => document.body}>
        <div data-testid="dialog">test</div>
      </Dialog>,
    );
    expect(screen.getByTestId('dialog').textContent).toEqual('test');
  });
  test('empty', () => {
    render(
      <Dialog visible={false} title="test" getContainer={() => document.body}>
        <div data-testid="dialog">test</div>
      </Dialog>,
    );
    expect(() => screen.getByTestId('dialog')).toThrow();
  });
  test('info', () => {
    let result: ReturnType<typeof info> = {
      update: () => {},
      close: () => {},
    };
    act(() => {
      result = info({
        title: 'test',
        visible: true,
        children: <div data-testid="dialog">test</div>,
      });
    });
    expect(screen.getByTestId('dialog').textContent).toEqual('test');
    act(() => {
      result.close();
    });
    expect(() => screen.getByTestId('dialog')).toThrow();
  });
  test('info update', () => {
    let result: ReturnType<typeof info> = {
      update: () => {},
      close: () => {},
    };
    act(() => {
      result = info({
        title: 'test',
        visible: true,
        children: <div data-testid="dialog">test</div>,
      });
    });
    expect(screen.getByTestId('dialog').textContent).toEqual('test');
    act(() => {
      result.update({
        title: 'test',
        visible: true,
        children: <div data-testid="dialog">11</div>,
      });
    });
    expect(screen.getByTestId('dialog').textContent).toEqual('11');
    act(() => {
      result.close();
    });
  });
});
