export function assert(condition, message = 'assert error', env = process.env.NODE_ENV) {
    if (!condition) {
        if (env !== 'test') {
            window.alert(message);
        }
        if (env === 'production') {
            console.error(message);
            return;
        }
        throw new Error(message);
    }
}
//# sourceMappingURL=assert.js.map