import { npx, DEFAULT_FONT_CONFIG, isNumber, DEFAULT_FONT_SIZE, DEFAULT_FONT_COLOR, makeFont, assert, ERROR_SET, ERROR_FORMULA_COLOR, dpr, isEmpty, } from '@/util';
import { EUnderLine, } from '@/types';
const measureTextMap = new Map();
export function measureText(ctx, char) {
    const mapKey = `${char}__${ctx.font}`;
    let temp = measureTextMap.get(mapKey);
    if (!temp) {
        const { actualBoundingBoxDescent, actualBoundingBoxAscent, width } = ctx.measureText(char);
        const result = {
            width: Math.ceil(width / dpr()),
            height: Math.ceil((actualBoundingBoxDescent + actualBoundingBoxAscent) / dpr()),
        };
        measureTextMap.set(mapKey, result);
        temp = result;
    }
    return temp;
}
export function fillRect(ctx, x, y, width, height) {
    ctx.fillRect(npx(x), npx(y), npx(width), npx(height));
}
export function strokeRect(ctx, x, y, width, height) {
    ctx.strokeRect(npx(x), npx(y), npx(width), npx(height));
}
export function clearRect(ctx, x, y, width, height) {
    ctx.clearRect(npx(x), npx(y), npx(width), npx(height));
}
export function fillText(ctx, text, x, y) {
    ctx.fillText(text, npx(x), npx(y));
}
function convertValueToString(value) {
    let text = String(value);
    if (typeof value === 'boolean' ||
        ['TRUE', 'FALSE'].includes(text.toUpperCase())) {
        text = text.toUpperCase();
    }
    else if (value === undefined || value === null) {
        text = '';
    }
    return text;
}
export function renderCell(ctx, cellInfo) {
    const { style, value, left, top, width, height } = cellInfo;
    const isNum = isNumber(value);
    let font = DEFAULT_FONT_CONFIG;
    let fillStyle = DEFAULT_FONT_COLOR;
    if (!isEmpty(style)) {
        const fontSize = style?.fontSize ? style.fontSize : DEFAULT_FONT_SIZE;
        font = makeFont(style?.isItalic ? 'italic' : 'normal', style?.isBold ? 'bold' : '500', npx(fontSize), style?.fontFamily);
        fillStyle = style?.fontColor || DEFAULT_FONT_COLOR;
        if (style?.fillColor) {
            ctx.fillStyle = style?.fillColor;
            fillRect(ctx, left, top, width, height);
        }
    }
    const text = convertValueToString(value);
    if (ERROR_SET.has(text)) {
        fillStyle = ERROR_FORMULA_COLOR;
    }
    const result = {};
    const texts = [...text];
    if (texts.length === 0) {
        return result;
    }
    ctx.textAlign = isNum ? 'right' : 'left';
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.textBaseline = 'middle';
    const textItemList = [];
    for (const char of texts) {
        if (char) {
            const t = measureText(ctx, char);
            textItemList.push({
                ...t,
                char,
            });
        }
    }
    if (textItemList.length === 0) {
        return result;
    }
    const x = left + (isNum ? width : 0);
    if (style?.underline) {
        ctx.strokeStyle = fillStyle;
    }
    if (style?.isWrapText) {
        let y = top;
        const offset = 4;
        for (let i = 0; i < textItemList.length;) {
            let t = width;
            const lastIndex = i;
            while (i < textItemList.length && textItemList[i].width < t) {
                t -= textItemList[i].width;
                i++;
            }
            if (lastIndex !== i) {
                let textHeight = 0;
                const textData = [];
                for (let k = lastIndex; k < i; k++) {
                    if (textItemList[k].height > textHeight) {
                        textHeight = textItemList[k].height;
                    }
                    textData.push(textItemList[k].char);
                }
                result.fontSizeHeight = Math.max(result.fontSizeHeight || 0, textHeight);
                y = y + Math.floor(textHeight / 2) + offset;
                const b = textData.join('');
                fillText(ctx, b, x, y);
                if (style?.underline) {
                    const t = Math.floor(y + textHeight / 2);
                    let pointList = [];
                    if (!isNum) {
                        pointList = [
                            [x, t],
                            [x + width, t],
                        ];
                    }
                    else {
                        pointList = [
                            [left, t],
                            [left + width, t],
                        ];
                    }
                    drawUnderline(ctx, pointList, style?.underline);
                }
                y = y + Math.floor(textHeight / 2);
            }
        }
        y += offset;
        result.wrapHeight = y - top;
    }
    else {
        const textHeight = Math.max(...textItemList.map((v) => v.height), 0);
        result.fontSizeHeight = textHeight;
        const offset = Math.max(0, Math.floor(height - textHeight) / 2);
        const y = Math.floor(top + textHeight / 2 + offset);
        let textWidth = 0;
        const textData = [];
        let t = width;
        for (let i = 0; i < textItemList.length; i++) {
            if (textItemList[i].width < t) {
                t -= textItemList[i].width;
                textData.push(textItemList[i].char);
                textWidth += textItemList[i].width;
            }
        }
        fillText(ctx, textData.join(''), x, y);
        if (style?.underline) {
            const t = Math.floor(y + textHeight / 2);
            let pointList = [];
            if (!isNum) {
                pointList = [
                    [x, t],
                    [x + textWidth, t],
                ];
            }
            else {
                pointList = [
                    [left, t],
                    [left + textWidth, t],
                ];
            }
            drawUnderline(ctx, pointList, style?.underline);
        }
    }
    return result;
}
export function drawLines(ctx, pointList) {
    assert(pointList.length > 0);
    ctx.beginPath();
    for (let i = 0; i < pointList.length; i += 2) {
        const first = pointList[i];
        const second = pointList[i + 1];
        ctx.moveTo(npx(first[0]), npx(first[1]));
        ctx.lineTo(npx(second[0]), npx(second[1]));
    }
    ctx.stroke();
}
export function drawTriangle(ctx, point1, point2, point3) {
    ctx.beginPath();
    ctx.moveTo(npx(point1[0]), npx(point1[1]));
    ctx.lineTo(npx(point2[0]), npx(point2[1]));
    ctx.lineTo(npx(point3[0]), npx(point3[1]));
    ctx.fill();
}
export function drawAntLine(ctx, x, y, width, height) {
    const oldDash = ctx.getLineDash();
    ctx.setLineDash([npx(8), npx(6)]);
    const offset = dpr() / 2;
    strokeRect(ctx, x + offset, y + offset, width - offset * 2, height - offset * 2);
    ctx.setLineDash(oldDash);
}
export function drawUnderline(ctx, pointList, underline) {
    const [start, end] = pointList;
    const offset = dpr();
    const list = [
        [start[0], start[1] - offset],
        [end[0], end[1] - offset],
    ];
    if (underline === EUnderLine.DOUBLE) {
        const t = offset * 2;
        list.push([start[0], start[1] - t], [end[0], end[1] - t]);
    }
    drawLines(ctx, list);
}
export function resizeCanvas(canvas, width, height) {
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const realWidth = npx(width);
    const realHeight = npx(height);
    canvas.width = realWidth;
    canvas.height = realHeight;
}
//# sourceMappingURL=util.js.map