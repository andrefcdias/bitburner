import type { NS } from "@ns";
import { getNodes } from "./lib/nodes";
import { clearTerminal } from "./lib/common";

export async function main(ns: NS): Promise<void> {
  const { verbose: VERBOSE } = ns.flags([["verbose", false]]);
  const nodes = getNodes(ns);
  const playerHackSkill = ns.getPlayer().skills.hacking;
  const CRACKERS = [ns.relaysmtp, ns.ftpcrack, ns.brutessh, ns.nuke];

  clearTerminal(ns);

  ns.tprint("Cracking all possible nodes...");

  let successCount = 0;
  nodes.forEach((node) => {
    if (node.hasAdminRights) {
      VERBOSE && ns.tprint(`[SKIP] ${node.hostname} - Already have access`);
      return;
    }

    if (
      node.hackDifficulty === undefined ||
      node.hackDifficulty > playerHackSkill
    ) {
      VERBOSE &&
        ns.tprint(
          `[FAIL] ${node.hostname} - Hack too high\n(${node.hackDifficulty} > ${playerHackSkill})`
        );
      return;
    }

    if (
      node.numOpenPortsRequired === undefined ||
      node.numOpenPortsRequired > CRACKERS.length - 1
    ) {
      VERBOSE &&
        ns.tprint(
          `[FAIL] ${node.hostname} - Too many ports (${node.numOpenPortsRequired})`
        );
      return;
    }

    CRACKERS.forEach((cracker) => cracker(node.hostname));

    VERBOSE && ns.tprint(`[SUCCESS] ${node.hostname} - Cracked successfully`);

    successCount++;
  });

  ns.tprint(`${successCount} nodes cracked ✅`);

  ns.spawn("fetch-nodes.js", { spawnDelay: 1000 }, VERBOSE && "--verbose");
}
