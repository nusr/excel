export function classnames(...rest) {
    let result = "";
    for (const temp of rest) {
        if (typeof temp === "string" && temp) {
            result += `${temp} `;
        }
        if (typeof temp === "object") {
            for (const key of Object.keys(temp)) {
                if (temp[key]) {
                    result += `${key} `;
                }
            }
        }
    }
    return result.trim();
}
//# sourceMappingURL=classnames.js.map