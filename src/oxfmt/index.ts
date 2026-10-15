import type { OxfmtConfig } from "oxfmt";

const config: OxfmtConfig = {
  printWidth: 80,
  sortPackageJson: false,
  sortTailwindcss: {},
  // Same order as the `import/order` rule of the former ESLint config.
  sortImports: {
    groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
    internalPattern: ["@/"],
    newlinesBetween: false,
    ignoreCase: true,
  },
  ignorePatterns: [".claude/worktrees"],
};

export default config;
