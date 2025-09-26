/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['@repo/config/eslint/nest.js'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
};
