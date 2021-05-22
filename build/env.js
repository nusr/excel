/* eslint-disable no-undef */
const getEnv = () => {
  const [, , ...rest] = process.argv;
  return rest.reduce((prev, current = "") => {
    const [key, value] = current.trim().split("=");
    const temp = key.trim();
    return {
      ...prev,
      [temp]: value.trim(),
    };
  }, {});
};
module.exports = {
  getEnv,
};
