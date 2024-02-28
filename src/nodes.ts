import type { NS } from "@ns";
import { getNodes } from "./lib/nodes";

export async function main(ns: NS): Promise<void> {
  const nodes = getNodes(ns);

  nodes
    .sort(
      (a, b) => (a.requiredHackingSkill || 0) - (b.requiredHackingSkill || 0)
    )
    .forEach((n) => {
      ns.tprint(`${n.hostname} - ${n.requiredHackingSkill}`);
    });
}
