export function dpr(data = window.devicePixelRatio) {
    return Math.max(Math.floor(data || 1), 1);
}
export function npx(px) {
    return Math.floor(px * dpr());
}
export function thinLineWidth() {
    return 1;
}
export function isMac() {
    return navigator.userAgent.indexOf('Mac OS X') > -1;
}
//# sourceMappingURL=dpr.js.map