/* eslint-disable no-undef */
const getEnv = () => {
  const [, , ...rest] = process.argv;
  const result = rest.reduce((prev, current = "") => {
    const [key = "", value = ""] = current.trim().split("=");
    const temp = key.trim();
    if (temp) {
      prev[temp] = value.trim();
    }
    return prev;
  }, {});
  return result;
};
module.exports = {
  getEnv,
};
