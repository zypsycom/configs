import { defineConfig } from "oxlint";
import zypsy, { restrictedSyntax } from "../../../dist/oxlint/index.js";

export default defineConfig({
  extends: [zypsy],
  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      rules: {
        "zypsy/restricted-syntax": [
          "error",
          ...restrictedSyntax,
          {
            selector: "TSEnumDeclaration",
            message: "Use a union of string literals.",
          },
        ],
      },
    },
  ],
});
