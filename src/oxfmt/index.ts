import type { OxfmtConfig } from "oxfmt";

const config: OxfmtConfig = {
  printWidth: 80,
  sortPackageJson: false,
  sortTailwindcss: {},
  sortImports: {
    groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
    internalPattern: ["@/"],
    newlinesBetween: false,
    ignoreCase: true,
  },
  ignorePatterns: [".claude/worktrees"],
};

export default config;
