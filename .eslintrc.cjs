module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'unused-imports'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  env: { node: true, es2022: true },
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    'no-console': 'off',
    'unused-imports/no-unused-imports': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}


