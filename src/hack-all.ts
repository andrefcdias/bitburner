import type { NS } from "@ns";
import { getNodes } from "./lib/nodes";

export async function main(ns: NS): Promise<void> {
  const nodes = getNodes(ns);
  const scriptName = "simple-hack.js";
  const scriptCost = ns.getScriptRam(scriptName);

  nodes.forEach((node) => {
    if (!node.hasAdminRights) return;

    ns.scp(scriptName, node.hostname);
    const availableRam =
      ns.getServerMaxRam(node.hostname) - ns.getServerUsedRam(node.hostname);
    const threads = Math.floor(availableRam / scriptCost);

    if (threads === 0) {
      ns.print(`[ERROR] ${availableRam} RAM on ${node.hostname}`);
      return;
    }

    ns.exec(
      scriptName,
      node.hostname,
      {
        threads,
      },
      node.hostname
    );
  });
}
