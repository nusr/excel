const proxyObj = new Proxy(
  {},
  {
    get: (_target, key) => {
      if (key === '__esModule') {
        return false;
      }
      return key;
    },
  },
);

module.exports = proxyObj;
