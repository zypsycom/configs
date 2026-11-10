import { defineConfig } from "oxfmt";
import zypsy from "./dist/oxfmt/index.js";

export default defineConfig({
  ...zypsy,
  ignorePatterns: [
    ...(zypsy.ignorePatterns ?? []),
    // Written by release-please on every release
    "CHANGELOG.md",
  ],
});
