module.exports = {
  parserOptions: {
    project: [
      'tsconfig.json',
      'tsconfig.*.json'
    ],
  },
  extends: [
    '@compass-aiden/eslint-config/nest',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'deploy/**/data'],
  rules: {
    'max-classes-per-file': 'off', // dto内会声明多个dto class
    'class-methods-use-this': 'off',
    'import/no-import-module-exports': 'off',
  },
};
