import { type Label } from "./inline";
import { type Count, total } from "./mixed";
import type { Flag } from "./top-level";

export const describe = (label: Label, count: Count, flag: Flag) =>
  `${label} ${String(count + total)} ${String(flag)}`;
