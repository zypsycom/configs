# @zypsy/configs

Zypsy's shared configuration for JavaScript and TypeScript projects: linting with [oxlint](https://oxc.rs/docs/guide/usage/linter), formatting with [oxfmt](https://oxc.rs/docs/guide/usage/formatter) and a TypeScript base for Next.js apps.

| Import                              | What                                                    |
| ----------------------------------- | ------------------------------------------------------- |
| `@zypsy/configs/oxlint`             | oxlint config, strict and type-aware                    |
| `@zypsy/configs/oxlint-plugin`      | the `zypsy` oxlint plugin, loaded by the oxlint config  |
| `@zypsy/configs/oxfmt`              | oxfmt config: Tailwind class sorting and import sorting |
| `@zypsy/configs/tsconfig/next.json` | `compilerOptions` for a Next.js app                     |

## Requirements

- Node 22.18 or later.
- `oxlint` 1.88 or later and `oxlint-tsgolint` 7 for the oxlint config, `oxfmt` 0.73 or later for the oxfmt config, TypeScript 7 for the tsconfig. They are peer dependencies, so the versions are yours to pin.

## Install

```bash
pnpm add -D @zypsy/configs oxlint oxlint-tsgolint oxfmt
```

## oxlint

`oxlint.config.ts`:

```ts
import zypsy from "@zypsy/configs/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [zypsy],
});
```

Add what is specific to your project after `extends`, for example:

```ts
export default defineConfig({
  extends: [zypsy],
  ignorePatterns: ["src/generated/**"],
  settings: { react: { version: "19.3.0" } },
  overrides: [{ files: ["src/env.js"], env: { node: true } }],
});
```

What the config does:

- **Type-aware.** The typescript-eslint `strict-type-checked` and `stylistic-type-checked` rules run through `oxlint-tsgolint`: floating promises, unsafe `any`, unnecessary assertions, deprecated APIs.
- **React and the React Compiler rules**: rules of hooks, exhaustive dependencies, purity, immutability. `settings.react.version` is set to `19.3.0`; set yours if it differs.
- **Imports**: no cycles, no duplicate imports, no `import { type A }` that leaves a side-effect import behind (write `import type { A }`), no default exports (except in `src/app`, stories and config files), no file extensions.
- **House style** in `src/**`:
  - Arrow functions only, no `function` declarations or expressions.
  - No explicit return types on arrow functions: inference is enough.
  - `.at(0)` and `.at(-1)` instead of `array[0]` and `array[array.length - 1]`, which pairs with `noUncheckedIndexedAccess`.
  - No variable or parameter named `e`: write `event` or `error`.
- Rules still in oxlint's nursery stay off until they are stable: `no-unnecessary-condition`, `prefer-optional-chain`, `import/export`, `no-undef`, `react/require-render-return`.

## oxlint plugin

oxlint has no native `no-restricted-syntax`, so the `zypsy` plugin provides it as `zypsy/restricted-syntax`, over oxlint's selector engine. The oxlint config already loads the plugin and uses it for the house style above. Rule options replace the shared ones rather than merge, so to ban more syntax, spread the shared selectors, exported as `restrictedSyntax`, in an override for the same files:

```ts
import zypsy, { restrictedSyntax } from "@zypsy/configs/oxlint";
import { defineConfig } from "oxlint";

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
```

A disable comment names the rule like any other: `// oxlint-disable-next-line zypsy/restricted-syntax`.

## oxfmt

oxfmt has no `extends`, so spread the shared config in `oxfmt.config.ts`:

```ts
import zypsy from "@zypsy/configs/oxfmt";
import { defineConfig } from "oxfmt";

export default defineConfig({
  ...zypsy,
  ignorePatterns: [...(zypsy.ignorePatterns ?? []), "supabase/templates"],
});
```

It formats at 80 columns, sorts Tailwind classes and sorts imports: builtin, external, internal (`@/`), then relative, with no blank lines between groups.

## tsconfig

```json
{
  "extends": "@zypsy/configs/tsconfig/next.json",
  "compilerOptions": { "paths": { "@/*": ["./src/*"] } },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next"]
}
```

Strict, with `noUncheckedIndexedAccess`, `verbatimModuleSyntax`, `checkJs` and the Next.js plugin. `paths`, `include` and `exclude` stay in your `tsconfig.json`, because TypeScript resolves them relative to the file that declares them.

## Scripts

```json
{
  "lint": "oxlint src",
  "lint:fix": "oxlint src --fix",
  "format": "oxfmt",
  "format:check": "oxfmt --check"
}
```

## Contributing

The sources are TypeScript in `src`, built by `vp pack` into `dist`. `pnpm prepush` builds, lints, formats, type-checks and runs the smoke test, which lints a fixture through the built config and checks that the house rules fire. A GitHub release tagged `v<version>` publishes the package to npm with provenance.

## License

[MIT](LICENSE)
