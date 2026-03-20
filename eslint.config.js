import globals from "globals";
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: { ...globals.node },
      ecmaVersion: "latest",
    },
    rules: {
      eqeqeq: ["error", "smart"],
      "no-trailing-spaces": "error",
      "object-curly-spacing": ["error", "always"],
      "arrow-spacing": ["error", { before: true, after: true }],
      "no-console": "off",
    },
  },
  {
    ignores: ["src/.internal/**"],
  },
];
