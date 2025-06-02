import jsPlugin from "@eslint/js";
import stylistiPlugin from "@stylistic/eslint-plugin";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { resolve as tsResolver } from "eslint-import-resolver-typescript";
import * as importPlugin from "eslint-plugin-import";
import jsdocPlugin from "eslint-plugin-jsdoc";
import explicitGenericsPlugin from "eslint-plugin-require-explicit-generics";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import globals from "globals";

const JS_MAX_PARAMS_ALLOWED = 4;

/** @typedef {import("eslint").Linter.Config} */
let FlatConfig;

/** @type {FlatConfig} */
const filesConfig = {
  files: ["**/*.{js,ts,tsx}"],
};

/** @type {FlatConfig} */
const ignoresConfig = {
  ignores: ["node_modules", "dist", "build", "apps", "packages", "public"],
};

/** @type {FlatConfig} */
const jsConfig = {
  languageOptions: {
    globals: globals.node,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  rules: {
    ...jsPlugin.configs.recommended.rules,
    "arrow-parens": ["error", "always"],
    curly: ["warn", "all"],
    eqeqeq: ["error", "always"],
    "max-params": ["warn", JS_MAX_PARAMS_ALLOWED],
    "no-console": ["warn"],
    "no-undef": "off",
    "no-multiple-empty-lines": [
      "warn",
      {
        max: 1,
      },
    ],
    "no-restricted-syntax": [
      "warn",
      {
        message: "Export/Import all (*) is forbidden.",
        selector: "ExportAllDeclaration,ImportAllDeclaration",
      },
      {
        message: "Exports should be at the end of the file.",
        selector: "ExportNamedDeclaration[declaration!=null]",
      },
      {
        message: "TS features are forbidden.",
        selector: "TSEnumDeclaration,ClassDeclaration[abstract=true]",
      },
      {
        message:
          "Avoid import/export type { Type } from './module'. Prefer import/export { type Type } from './module'.",
        selector:
          "ImportDeclaration[importKind=type],ExportNamedDeclaration[exportKind=type]",
      },
    ],
    "object-shorthand": ["error"],
    "prefer-destructuring": ["error"],

    quotes: ["warn", "double", { avoidEscape: true }],
  },
};

/** @type {FlatConfig} */
const importConfig = {
  plugins: {
    import: /** @type {import('eslint').Linter.Plugin} */ importPlugin,
  },
  rules: {
    ...importPlugin.configs.recommended.rules,
    "import/exports-last": ["warn"],
    "import/extensions": [
      "warn",
      {
        js: "always",
      },
    ],
    "import/newline-after-import": ["warn"],
    "import/no-default-export": ["warn"],
    "import/no-duplicates": ["warn"],
  },
  settings: {
    "import/parsers": {
      espree: [".js", ".cjs"],
    },
    "import/resolver": {
      typescript: tsResolver,
    },
  },
};

/** @type {FlatConfig} */
const sonarConfig = {
  plugins: {
    sonarjs:
      /** @type {import('eslint').Linter.Plugin} */ /** @type {unknown} */ sonarjsPlugin,
  },
  rules: {
    ...sonarjsPlugin.configs.recommended.rules,
    "sonarjs/no-duplicate-string": ["off"],
    "sonarjs/no-nested-template-literals": ["off"],
  },
};

/** @type {FlatConfig} */
const stylisticConfig = {
  plugins: {
    "@stylistic/js":
      /** @type {import('eslint').Linter.Plugin} */ stylistiPlugin,
  },
  rules: {
    "@stylistic/js/padding-line-between-statements": [
      "warn",
      {
        blankLine: "never",
        next: "export",
        prev: "export",
      },
      {
        blankLine: "always",
        next: "*",
        prev: ["block-like", "throw", "type"],
      },
      {
        blankLine: "always",
        next: ["return", "block-like", "throw", "type"],
        prev: "*",
      },
    ],
  },
};

/** @type {FlatConfig} */
const typescriptConfig = {
  ignores: ["eslint.config.js", "lint-staged.config.js", "stylelint.config.js"],
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
  plugins: {
    "@typescript-eslint" /** @type {import('eslint').Linter.Plugin} */:
      /** @type {unknown} */ tsPlugin,
  },
  rules: {
    ...tsPlugin.configs["strict-type-checked"].rules,
    "@typescript-eslint/explicit-member-accessibility": "off",
    "@typescript-eslint/consistent-type-exports": ["warn"],
    "@typescript-eslint/no-misused-spread": "off",
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        fixStyle: "inline-type-imports",
      },
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-magic-numbers": [
      "warn",
      {
        ignoreEnums: true,
        ignoreReadonlyClassProperties: true,
      },
    ],
    "@typescript-eslint/return-await": ["warn", "always"],
    "@typescript-eslint/no-extraneous-class": "off",
    "@typescript-eslint/restrict-template-expressions": [
      "warn",
      {
        allowNumber: true,
      },
    ],
    "@typescript-eslint/no-unnecessary-condition": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/no-invalid-void-type": "off",
    "no-undef": "off",
    "no-redeclare": "off",
  },
};

/** @type {FlatConfig} */
const jsdocConfig = {
  files: ["eslint.config.js", "lint-staged.config.js", "stylelint.config.js"],
  plugins: {
    jsdoc: jsdocPlugin,
  },
  rules: {
    ...jsdocPlugin.configs["recommended-typescript-flavor-error"].rules,
    "jsdoc/no-undefined-types": ["warn"],
    "jsdoc/require-returns-description": ["off"],
  },
};

/** @type {FlatConfig} */
const explicitGenericsConfig = {
  plugins: {
    "require-explicit-generics":
      /** @type {import('eslint').Linter.Plugin} */ explicitGenericsPlugin,
  },
};

/** @type {FlatConfig[]} */
const overridesConfigs = [
  {
    files: [
      "commitlint.config.ts",
      "prettier.config.ts",
      "stylelint.config.js",
      "knip.config.ts",
      "lint-staged.config.js",
      "eslint.config.js",
    ],
    rules: {
      "import/no-default-export": ["off"],
    },
  },
  {
    files: ["*.js"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": ["off"],
      "no-undef": "off",
    },
  },
  {
    files: ["src/db/migrations/**/*.ts"],
    rules: {
      "unicorn/filename-case": ["off"],
    },
  },
  {
    files: ["**/*.spec.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-magic-numbers": "off",
    },
  },
  {
    files: ["*.config.ts"],
    rules: {
      "import/no-default-export": "off",
    },
  },
];

/** @type {FlatConfig[]} */
const config = [
  filesConfig,
  ignoresConfig,
  jsConfig,
  importConfig,
  sonarConfig,
  stylisticConfig,
  typescriptConfig,
  jsdocConfig,
  explicitGenericsConfig,
  ...overridesConfigs,
];

export default config;
