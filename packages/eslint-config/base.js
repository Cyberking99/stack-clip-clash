module.exports = {
  extends: ["eslint:recommended", "prettier"],
  env: { node: true, browser: true, es2021: true },
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js"],
};
