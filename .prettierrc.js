module.exports = {
  printWidth: 120,
  tabWidth: 4,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  overrides: [
    {
      files: ['package.json', 'package-lock.json'],
      options: {
        tabWidth: 2,
      },
    },
  ],
};
