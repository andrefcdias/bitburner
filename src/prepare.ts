import type { NS } from "@ns";
import { getNodeNeedsGrow, getNodeNeedsHacking } from "./lib/common";
import { getNodes } from "./lib/nodes";

export async function main(ns: NS): Promise<void> {
  const nodes = getNodes(ns);

  for (const node of nodes) {
    if (!node.hasAdminRights) continue;

    let needsHacking = true;
    while ((needsHacking = getNodeNeedsHacking(ns, node.hostname))) {
      await ns.weaken(node.hostname);
    }

    let needsGrow = true;
    while ((needsGrow = getNodeNeedsGrow(ns, node.hostname))) {
      await ns.grow(node.hostname);
    }

    ns.alert(`${node.hostname} is ready for hacking.`);
  }
}
