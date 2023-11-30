import type { NS } from "@ns";
import { getNodes } from "./lib/nodes";
import { clearTerminal } from "./lib/common";

export async function main(ns: NS): Promise<void> {
  const nodes = getNodes(ns);
  const playerHackSkill = ns.getPlayer().skills.hacking;
  const CRACKERS = [ns.relaysmtp, ns.ftpcrack, ns.brutessh, ns.nuke];

  clearTerminal(ns);

  ns.tprint(`[DEBUG] CRACKERS: ${CRACKERS.length}`);
  nodes.forEach((node, idx) => {
    if (node.hasAdminRights) {
      ns.tprint(`[SKIP] ${node.hostname} - Already have access`);
      return;
    }

    if (
      node.hackDifficulty === undefined ||
      node.hackDifficulty > playerHackSkill
    ) {
      ns.tprint(
        `[FAIL] ${node.hostname} - Hack too high\n(${node.hackDifficulty} > ${playerHackSkill})`
      );
      return;
    }

    ns.tprint(`[DEBUG] ${node.hostname} - Ports: ${node.numOpenPortsRequired}`);
    if (
      node.numOpenPortsRequired === undefined ||
      node.numOpenPortsRequired > CRACKERS.length - 1
    ) {
      ns.tprint(
        `[FAIL] ${node.hostname} - Too many ports (${node.numOpenPortsRequired})`
      );
      return;
    }

    CRACKERS.forEach((cracker) => cracker(node.hostname));

    ns.tprint(`[SUCCESS] ${node.hostname} - Cracked successfully`);
  });

  ns.spawn("fetch-nodes.js", { spawnDelay: 1000 });
}
