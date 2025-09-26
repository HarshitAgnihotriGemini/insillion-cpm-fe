import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import angularEslintPlugin from "@angular-eslint/eslint-plugin";
import globals from "globals";

const angularConfigs = angularEslintPlugin.configs;

export default [
  {
    ignores: ["dist/**", "build/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: require.resolve("@typescript-eslint/parser"),
      parserOptions: {
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@angular-eslint": angularEslintPlugin,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...angularConfigs.recommended.rules,
      ...angularConfigs["recommended--extra"].rules,
      ...angularConfigs["recommended--ng-cli-compat"].rules,

      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          semi: true,
          trailingComma: "all",
          printWidth: 100,
          tabWidth: 2,
          bracketSpacing: true,
          arrowParens: "always",
          endOfLine: "auto",
        },
      ],

      "no-console": "warn",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.html"],
    languageOptions: {
      parser: require.resolve("@angular-eslint/template-parser"),
    },
    plugins: {
      "@angular-eslint/template": angularTemplate,
    },
    rules: {
      ...angularTemplate.configs.recommended.rules,
    },
  },
];
