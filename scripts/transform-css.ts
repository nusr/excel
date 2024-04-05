import path from 'path';

function process(_sourceText: string, sourcePath: string) {
  return {
    code: `module.exports = ${JSON.stringify(path.basename(sourcePath))};`,
  };
}

export default { process };
