import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: {
        ...globals.node,
        ...globals.jest
      } 
    },
    rules: {
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_", 
        "varsIgnorePattern": "^_"
      }],

      "no-unreachable": "error",

      "no-use-before-define": "error",

      "no-console": ["warn", { allow: ["warn", "error"] }]
    } 
  },
]);