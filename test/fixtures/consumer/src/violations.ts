export function declared() {
  return 1;
}
export const expression = function () {
  return 2;
};
export const typed = (): number => 3;
const list = [1, 2, 3];
export const first = list[0];
export const last = list[list.length - 1];
export const firstFile = (input: HTMLInputElement) => input.files?.[0];
export const e = 1;
const load = async () => {
  await Promise.resolve();
};
export const run = () => {
  load();
};
