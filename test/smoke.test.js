import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const consumer = fileURLToPath(new URL("fixtures/consumer/", import.meta.url));
const oxlint = fileURLToPath(
  new URL("../node_modules/.bin/oxlint", import.meta.url),
);

/** @typedef {{ code: string; message: string; labels: Array<{ span: { line: number } }> }} Diagnostic */

const lint = () => {
  const result = spawnSync(oxlint, ["-f", "json", "src"], {
    cwd: consumer,
    encoding: "utf8",
  });
  /** @type {{ diagnostics: Diagnostic[] }} */
  const report = JSON.parse(result.stdout);
  return report.diagnostics.map((diagnostic) => ({
    rule: diagnostic.code,
    message: diagnostic.message,
    line: diagnostic.labels.at(0)?.span.line,
  }));
};

const diagnostics = lint();

/** @param {string} rule @param {number} line @param {string} [message] */
const hasDiagnostic = (rule, line, message) =>
  diagnostics.some(
    (diagnostic) =>
      diagnostic.rule === rule &&
      diagnostic.line === line &&
      (message === undefined || diagnostic.message === message),
  );

const restrictedSyntax = [
  { line: 1, message: "Using 'FunctionDeclaration' is not allowed." },
  { line: 4, message: "Using 'FunctionExpression' is not allowed." },
  {
    line: 7,
    message:
      "Arrow functions should not have explicit return types as per team agreement.",
  },
  { line: 9, message: "Use .at(0) instead of [0] for array access" },
  {
    line: 10,
    message:
      "Use .at(-1) instead of [array.length - 1] for accessing the last element",
  },
];

for (const { line, message } of restrictedSyntax) {
  test(`zypsy/restricted-syntax: ${message}`, () => {
    assert.ok(hasDiagnostic("zypsy(restricted-syntax)", line, message));
  });
}

test("FileList access stays allowed", () => {
  assert.ok(!diagnostics.some((diagnostic) => diagnostic.line === 11));
});

test("func-style rejects function declarations", () => {
  assert.ok(hasDiagnostic("eslint(func-style)", 1));
});

test("a variable named `e` is rejected", () => {
  assert.ok(hasDiagnostic("eslint(id-denylist)", 12));
});

test("type-aware rules run", () => {
  assert.ok(hasDiagnostic("typescript(no-floating-promises)", 17));
});
