import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const [target] = ns.args;
  const parsedTarget = target as string;

  while (true) {
    await ns.weaken(parsedTarget);
    await ns.grow(parsedTarget);
    await ns.hack(parsedTarget);
  }
}
