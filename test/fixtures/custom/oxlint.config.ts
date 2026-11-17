import { defineConfig } from "oxlint";
import { createConfig } from "../../../dist/oxlint/index.js";

export default defineConfig({
  extends: [
    createConfig({ files: { defaultExports: ["src/routes/**/*.ts"] } }),
  ],
});
