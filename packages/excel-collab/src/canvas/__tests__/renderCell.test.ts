import { vi } from 'vitest';
import { renderCell } from '../util';

function createContext(charWidth: number) {
  const fillText = vi.fn();
  const ctx = {
    font: '',
    fillStyle: '',
    measureText: (text: string) => ({
      width: [...text].length * charWidth,
      actualBoundingBoxAscent: 8,
      actualBoundingBoxDescent: 2,
    }),
    fillText,
  } as unknown as CanvasRenderingContext2D;
  return { ctx, fillText };
}

describe('renderCell', () => {
  test('does not draw text when it cannot fit in the cell', () => {
    const fillText = vi.fn();
    const ctx = {
      font: '',
      fillStyle: '',
      measureText: () => ({
        width: 30,
        actualBoundingBoxAscent: 8,
        actualBoundingBoxDescent: 2,
      }),
      fillText,
    } as unknown as CanvasRenderingContext2D;

    renderCell(ctx, { left: 20, top: 20, width: 10, height: 5 }, { value: 'too large' });

    expect(fillText).not.toHaveBeenCalled();
  });

  test('renders explicit line breaks as separate wrapped lines', () => {
    const { ctx, fillText } = createContext(6);
    renderCell(
      ctx,
      { left: 0, top: 0, width: 120, height: 60 },
      { value: 'first\nsecond', isWrapText: true },
    );

    expect(fillText.mock.calls.map(([text]) => text)).toEqual(['first', 'second']);
  });

  test('preserves vertical space for blank lines', () => {
    const regular = createContext(6);
    renderCell(
      regular.ctx,
      { left: 0, top: 0, width: 120, height: 100 },
      { value: 'first\nsecond', isWrapText: true },
    );
    const regularGap = regular.fillText.mock.calls[1][2] - regular.fillText.mock.calls[0][2];

    const blank = createContext(6);
    renderCell(
      blank.ctx,
      { left: 0, top: 0, width: 120, height: 100 },
      { value: 'first\n\nsecond', isWrapText: true },
    );
    const blankGap = blank.fillText.mock.calls[1][2] - blank.fillText.mock.calls[0][2];

    expect(blankGap).toBeGreaterThan(regularGap);
  });

  test('wraps long words to the cell width', () => {
    const { ctx, fillText } = createContext(10);
    const result = renderCell(
      ctx,
      { left: 0, top: 0, width: 30, height: 60 },
      { value: 'abcdef', isWrapText: true },
    );

    const lines = fillText.mock.calls.map(([text]) => text);
    expect(lines.join('')).toBe('abcdef');
    expect(lines.length).toBeGreaterThan(1);
    expect(result.width).toBeLessThanOrEqual(30);
  });
});
