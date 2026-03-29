import js from "@eslint/js";
import checkFile from "eslint-plugin-check-file";
import globals from "globals";
import tseslint from "typescript-eslint";

const ignores = [
  "**/.next/**",
  "**/.turbo/**",
  "**/coverage/**",
  "**/dist/**",
  "**/node_modules/**",
  "**/playwright-report/**",
  "**/test-results/**",
];

const typedFiles = ["**/*.{ts,tsx,mts,cts}"];
const sourceFiles = [
  "apps/web/src/**/*.{ts,tsx,mts,cts}",
  "packages/*/src/**/*.{ts,tsx,mts,cts}",
  "src/**/*.{ts,tsx,mts,cts}",
];

const typedConfigs = tseslint.configs.recommendedTypeChecked.map((config) => ({
  ...config,
  files: typedFiles,
}));

const baseConfig = [
  {
    ignores,
  },
  js.configs.recommended,
  ...typedConfigs,
  {
    files: sourceFiles,
    plugins: {
      "check-file": checkFile,
    },
    rules: {
      "check-file/filename-naming-convention": [
        "error",
        {
          "**/*.{ts,tsx,mts,cts}": "KEBAB_CASE",
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
  {
    files: typedFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        {
          checksVoidReturn: false,
        },
      ],
    },
  },
];

export default baseConfig;
