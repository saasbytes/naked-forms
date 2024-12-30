/** @type {import('prettier').Config} **/
module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: false,
  endOfLine: 'lf',
  printWidth: 100,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: true,
  plugins: [require('prettier-plugin-organize-imports')],
}
