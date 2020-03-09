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
    commonjs: true,
    mocha: true
  },
  rules: {
    'prettier/prettier': 'error',
    'comma-dangle': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'no-use-before-define': ['error', { functions: false }],
  },
  "overrides": [
    {
      "files": ["examples/*.js"],
      "rules": {
        "import/no-unresolved": "off",
        "no-unused-expressions": "off"
      }
    }
  ],
};
