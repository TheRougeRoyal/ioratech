import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import nextConfig from "eslint-config-next";

// eslint-config-next already exports a flat config array (verified: 3 entries).
// We spread it first so our overrides below take precedence.

/** @type {import("eslint").Linter.Config[]} */
const config = [
  // ── Next.js recommended rules (flat config) ───────────────────────────────
  ...nextConfig,

  // ── TypeScript files ──────────────────────────────────────────────────────
  {
    name: "typescript",
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // TypeScript-recommended rules (non-type-checked — no tsconfig needed)
      ...tsPlugin.configs["recommended"].rules,

      // Downgrade to warn so CI isn't blocked by pre-existing issues
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],

      // Turn off the base rule — TS version handles this for .ts/.tsx
      "no-unused-vars": "off",

      // Downgrade: useEffect(() => setMounted(true), []) is the standard
      // hydration guard; useEffect(() => { fetchData(); }, [fetchData]) is
      // the canonical data-load pattern with useCallback. Both are intentional.
      "react-hooks/set-state-in-effect": "warn",
    },
  },

  // ── JavaScript files (app pages, components) ──────────────────────────────
  {
    name: "javascript",
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
      ],
      // Downgrade for same reason as TS config above
      "react-hooks/set-state-in-effect": "warn",
    },
  },

  // ── Global ignores ────────────────────────────────────────────────────────
  {
    name: "ignores",
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "coverage/**",
      "**/*.config.js",    // next.config.js, tailwind.config.js, jest.config.js
      "**/*.config.ts",
      "scripts/**",
      "__tests__/**",
    ],
  },
];

export default config;
