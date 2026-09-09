import tseslint from "typescript-eslint";
export default tseslint.config(
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".local/**",
      "dist/**",
      "output/**",
      "public/**",
      "assets/**",
      "api/**",
      "server/**",
      "lib/**",
      "scripts/**",
      "*.js",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
);
