const {
    defineConfig,
} = require("eslint/config");

const tsParser = require("@typescript-eslint/parser");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = defineConfig([{
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 2020,
        sourceType: "module",
        parserOptions: {},
    },

    plugins: {
        "@typescript-eslint": typescriptEslint,
    },

    extends: compat.extends(
        "next",
        "next/core-web-vitals",
        "plugin:@typescript-eslint/recommended",
        "eslint:recommended",
    ),

    rules: {
        "@typescript-eslint/no-unused-vars": ["warn"],
    },
}]);
