module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    'eslint:recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    "vue/order-in-components": ["error"],
    "vue/html-indent": ["error", 4],
    "vue/max-attributes-per-line": ["error", {
      "singleline": 3,
      "multiline": {
        "max": 3
      }
    }],
    'no-console': process.env.NODE_ENV === 'production' ? ["error", { allow: ["error"] }] : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-empty': 'off',
    'no-unused-vars': 'off',
    'vue/require-prop-types': 'off',
    'vue/require-default-prop': 'off',
    'vue/singleline-html-element-content-newline': 'off'
  }
}
