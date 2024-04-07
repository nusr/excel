const path = require('path');

/**
 *
 * @param {string} _
 * @param {string} sourcePath
 * @returns
 */
function process(_, sourcePath) {
  return {
    code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
  };
}

module.exports = { process };
