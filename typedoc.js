/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['./src/index.ts'],
  out: 'docs',
  name: 'Excel Docs',
  tsconfig: './tsconfig.json',
  excludePrivate: true,
};
