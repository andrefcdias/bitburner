import type { NS } from "@ns";
import { getNodes } from "./lib/nodes";

export async function main(ns: NS): Promise<void> {
  const { deep } = ns.flags([["deep", false]]);

  let nodes = getNodes(ns);
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.hasAdminRights) {
      let estimatedSecDrop = 5;
      let estimatedMoneyGrow = 0;

      while (true) {
        const currentMoneyLevel = ns.getServerMoneyAvailable(node.hostname);
        if (!deep && currentMoneyLevel === 0) {
          ns.print(`❌ ${node.hostname} has no money`);
          break;
        }

        const minSecurityLevel = ns.getServerMinSecurityLevel(node.hostname);
        const currentSecurityLevel = ns.getServerSecurityLevel(node.hostname);
        const secDiff = currentSecurityLevel - minSecurityLevel;

        if (secDiff - estimatedSecDrop > 0) {
          estimatedSecDrop = await ns.weaken(node.hostname);
          continue;
        }

        const maxMoneyLevel = ns.getServerMaxMoney(node.hostname);
        const moneyDiff = maxMoneyLevel - currentMoneyLevel;

        if (moneyDiff - estimatedMoneyGrow > 0) {
          estimatedMoneyGrow = await ns.grow(node.hostname);
          continue;
        }

        break;
      }

      ns.print(`✅ ${node.hostname} is ready for hacking.`);
    }

    if (i === nodes.length - 1) {
      ns.print(`🔄 Re-fetching node info...`);
      nodes = getNodes(ns);
      i = -1;
    }
  }
}
