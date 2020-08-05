module.exports = {
  root: true,
  env: {
    node: true,
    "jest/globals": true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/prettier",
    "plugin:cypress/recommended"
  ],
  plugins: ["jest"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "jest/no-disabled-tests": "warn",
    "jest/no-focused-tests": "error",
    "jest/no-identical-title": "error",
    "jest/prefer-to-have-length": "warn",
    "jest/valid-expect": "error"
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
