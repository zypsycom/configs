# @zypsy/configs

Shared tooling configuration for Zypsy repositories:

| Import                              | What                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `@zypsy/configs/oxlint`             | oxlint config, type-aware, ported from `@stanfordspezi/spezi-web-configurations` + house rules |
| `@zypsy/configs/oxlint-plugin`      | the `zypsy` oxlint JS plugin, already loaded by the oxlint config                              |
| `@zypsy/configs/oxfmt`              | oxfmt config: Tailwind class sorting, import sorting, 80 columns                               |
| `@zypsy/configs/tsconfig/next.json` | `compilerOptions` shared by the Next.js apps                                                   |

The sources are TypeScript in `src`, built by `vp pack` (Vite+, on tsdown and Rolldown) into `dist` as ESM `.js` with `.d.ts`. Node does not strip types inside `node_modules`, so the package ships the build, and consumers keep their own `oxlint.config.ts` and `oxfmt.config.ts`.

## Install

```bash
pnpm add -D @zypsy/configs oxlint oxlint-tsgolint oxfmt
```

It is a public npm package: installing it needs no token or `.npmrc`, on a laptop, in CI or on Vercel.

## Use

`oxlint.config.ts`:

```ts
import zypsy from "@zypsy/configs/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [zypsy],
  // Only what is specific to this repository.
  ignorePatterns: ["src/utils/supabase/databaseTypes.ts"],
  overrides: [{ files: ["src/env.js"], env: { node: true } }],
});
```

`oxfmt.config.ts` (oxfmt has no `extends`, spread the shared config):

```ts
import zypsy from "@zypsy/configs/oxfmt";
import { defineConfig } from "oxfmt";

export default defineConfig({
  ...zypsy,
  ignorePatterns: [...(zypsy.ignorePatterns ?? []), "supabase/templates"],
});
```

`tsconfig.json`:

```json
{
  "extends": "@zypsy/configs/tsconfig/next.json",
  "compilerOptions": { "paths": { "@/*": ["./src/*"] } },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    "**/*.cjs",
    "**/*.js",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules", ".next"]
}
```

`paths`, `include` and `exclude` stay in the repository, because TypeScript resolves them relative to the file that declares them.

`package.json` scripts:

```json
{
  "lint": "oxlint src",
  "lint:fix": "oxlint src --fix",
  "format": "oxfmt",
  "format:check": "oxfmt --check"
}
```

The oxlint config sets `settings.react.version` to `19.3.0`; a repository on another React version overrides it.

## The `zypsy` plugin

oxlint has no native `no-restricted-syntax`, so `zypsy/restricted-syntax` is that rule over oxlint's selector engine. The config enables it in `src/**/*.{ts,tsx}` with these selectors:

- `FunctionDeclaration`, `FunctionExpression`: arrow functions only.
- `ArrowFunctionExpression[returnType]`: no explicit return types.
- `array[0]` (except on a `files` list) and `array[array.length - 1]`: use `.at(0)` and `.at(-1)`.

A disable comment names it like any other rule: `// oxlint-disable-next-line zypsy/restricted-syntax`.

Rules still in oxlint's nursery stay off until they are stable: `no-unnecessary-condition`, `prefer-optional-chain`, `import/export`, `no-undef`, `react/require-render-return`.

## Development

```bash
pnpm install
pnpm build     # vp pack: src -> dist
pnpm prepush   # build, lint fix, format, type check, smoke test
```

`pnpm test` lints `test/fixtures/consumer` through the built config in `dist` and checks that every selector, `func-style`, the ban on `e` and a type-aware rule fire.

## Releasing

Publishing runs in `.github/workflows/release.yml` when a GitHub release is published. It uses npm trusted publishing: GitHub's OIDC token proves which workflow publishes, so there is no npm token anywhere and npm attaches provenance itself.

1. Bump `version` in `package.json` and merge.
2. Create a GitHub release with the tag `v<version>`. The workflow checks the tag against `package.json`, runs CI and publishes.

### One-time setup

1. On npmjs.com: **Add an Organization** named `zypsy`, plan **Unlimited public packages** (free). The account needs two-factor authentication.
2. Make the GitHub repository public. npm only attaches provenance to packages published from a public repository.
3. Publish the first version by hand, because trusted publishing can only be configured on a package that exists: `npm login`, then `npm publish --access public` from a clean checkout of `main`.
4. On the package page, **Settings → Trusted publishing**: GitHub Actions, organization `zypsycom`, repository `configs`, workflow `release.yml`, environment `npm`.
5. In the repository, **Settings → Environments**: create `npm`, optionally with required reviewers.
6. On the package page, **Settings → Publishing access**: **Require two-factor authentication and disallow tokens**. Trusted publishing keeps working.
