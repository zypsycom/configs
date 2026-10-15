import type { Node, Plugin, Rule } from "@oxlint/plugins";

export type RestrictedSyntaxOption =
  | string
  | { selector: string; message?: string };

// oxlint has no native `no-restricted-syntax`, this is ESLint's rule over oxlint's selector engine.
const restrictedSyntax: Rule = {
  meta: {
    type: "suggestion",
    docs: { description: "Disallow syntax matched by ESLint-style selectors" },
    schema: {
      type: "array",
      items: {
        anyOf: [
          { type: "string" },
          {
            type: "object",
            properties: {
              selector: { type: "string" },
              message: { type: "string" },
            },
            required: ["selector"],
            additionalProperties: false,
          },
        ],
      },
    },
  },
  create: (context) =>
    Object.fromEntries(
      (context.options as RestrictedSyntaxOption[]).map((option) => {
        const { selector, message } =
          typeof option === "string" ? { selector: option } : option;
        return [
          selector,
          (node: Node) => {
            context.report({
              node,
              message: message ?? `Using '${selector}' is not allowed.`,
            });
          },
        ];
      }),
    ),
};

const plugin: Plugin = {
  meta: { name: "zypsy" },
  rules: { "restricted-syntax": restrictedSyntax },
};

export default plugin;
