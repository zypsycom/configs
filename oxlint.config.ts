import { defineConfig } from "oxlint";
import zypsy from "./dist/oxlint/index.js";

export default defineConfig({
  extends: [zypsy],
  ignorePatterns: ["test/fixtures/**"],
  overrides: [
    {
      // Node resolves ESM imports by their full file name.
      files: ["**/*.{js,ts}"],
      rules: { "import/extensions": "off" },
    },
    {
      // Consumers import each config as the module's default export.
      files: ["src/**"],
      rules: { "import/no-default-export": "off" },
    },
  ],
});
