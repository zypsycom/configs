import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: [
      "src/oxlint/index.ts",
      "src/oxlint/plugin.ts",
      "src/oxfmt/index.ts",
    ],
    // One output file per source file: the oxlint config finds its plugin
    // next to it at runtime, so the plugin must stay a file of its own.
    unbundle: true,
    format: "esm",
    platform: "node",
    dts: true,
    // `type: "module"` already makes .js ESM, and the config resolves "./plugin.js".
    fixedExtension: false,
    copy: [{ from: "src/tsconfig", to: "dist" }],
  },
});
