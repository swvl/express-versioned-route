module.exports = {
  rules: {},
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2017,
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    'prettier/prettier': 'error',
    'comma-dangle': 'off',
    // 'linebreak-style': ['error', 'windows'],
    // 'operator-linebreak': ['error', 'after'],
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'no-use-before-define': ['error', { functions: false }],
  },
};
