export function columnNameToInt(columnName = "") {
    const temp = columnName.toUpperCase();
    let num = 0;
    for (let i = 0; i < temp.length; i++) {
        num = temp.charCodeAt(i) - 64 + num * 26;
    }
    return num - 1;
}
export function intToColumnName(temp) {
    const num = temp + 1;
    let columnName = "";
    let dividend = Math.floor(Math.abs(num));
    let rest;
    while (dividend > 0) {
        rest = (dividend - 1) % 26;
        columnName = String.fromCharCode(65 + rest) + columnName;
        dividend = Math.floor((dividend - rest) / 26);
    }
    return columnName.toUpperCase();
}
export function rowLabelToInt(label) {
    let result = parseInt(label, 10);
    if (window.isNaN(result)) {
        result = -1;
    }
    else {
        result = Math.max(result - 1, -1);
    }
    return result;
}
export function intToRowLabel(row) {
    if (row >= 0) {
        return `${row + 1}`;
    }
    return "";
}
//# sourceMappingURL=convert.js.map