/** @typedef {string | { selector: string; message?: string }} RestrictedSyntaxOption */

// oxlint has no native `no-restricted-syntax`, this is ESLint's rule over oxlint's selector engine.
/** @type {import("@oxlint/plugins").Rule} */
const restrictedSyntax = {
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
      /** @type {RestrictedSyntaxOption[]} */ (context.options).map(
        (option) => {
          const { selector, message } =
            typeof option === "string" ? { selector: option } : option;
          return [
            selector,
            /** @param {import("@oxlint/plugins").Node} node */
            (node) => {
              context.report({
                node,
                message: message ?? `Using '${selector}' is not allowed.`,
              });
            },
          ];
        },
      ),
    ),
};

/** @type {import("@oxlint/plugins").Plugin} */
const plugin = {
  meta: { name: "zypsy" },
  rules: { "restricted-syntax": restrictedSyntax },
};

export default plugin;
