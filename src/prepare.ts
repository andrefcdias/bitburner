import type { NS } from "@ns";
import { getNodes } from "./lib/nodes";

export async function main(ns: NS): Promise<void> {
  const nodes = getNodes(ns);
  const { deep } = ns.flags([["deep", false]]);

  for (const node of nodes) {
    if (!node.hasAdminRights) continue;

    let estimatedSecDrop = 5;
    let estimatedMoneyGrow = 0;
    while (true) {
      const currentMoneyLevel = ns.getServerMoneyAvailable(node.hostname);
      if (!deep && currentMoneyLevel === 0) {
        ns.print(`[ERROR] ${node.hostname} has no money`);
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

    ns.alert(`${node.hostname} is ready for hacking.`);
  }
}
