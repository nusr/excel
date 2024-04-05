const obj = new Proxy(
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

export default obj;
