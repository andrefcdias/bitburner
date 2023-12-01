import type { NS } from "@ns";
import { getNodes } from "./lib/nodes";
import { clearTerminal } from "./lib/common";

export async function main(ns: NS): Promise<void> {
  const { verbose: VERBOSE } = ns.flags([["verbose", false]]);
  const nodes = getNodes(ns);
  const playerHackSkill = ns.getPlayer().skills.hacking;
  const CRACKERS: ((host: string) => void)[] = [];

  if (ns.fileExists("SQLInject.exe")) CRACKERS.push(ns.sqlinject);
  if (ns.fileExists("HTTPWorm.exe")) CRACKERS.push(ns.httpworm);
  if (ns.fileExists("relaySMTP.exe")) CRACKERS.push(ns.relaysmtp);
  if (ns.fileExists("FTPCrack.exe")) CRACKERS.push(ns.ftpcrack);
  if (ns.fileExists("BruteSSH.exe")) CRACKERS.push(ns.brutessh);

  CRACKERS.push(ns.nuke);

  // clearTerminal(ns);

  ns.print("Cracking all possible nodes...");

  let successCount = 0;
  nodes.forEach((node) => {
    if (node.hasAdminRights) {
      VERBOSE && ns.print(`[SKIP] ${node.hostname} - Already have access`);
      return;
    }

    if (
      node.hackDifficulty === undefined ||
      node.hackDifficulty > playerHackSkill
    ) {
      VERBOSE &&
        ns.print(
          `[FAIL] ${node.hostname} - Hack too high\n(${node.hackDifficulty} > ${playerHackSkill})`
        );
      return;
    }

    if (
      node.numOpenPortsRequired === undefined ||
      node.numOpenPortsRequired > CRACKERS.length - 1
    ) {
      VERBOSE &&
        ns.print(
          `[FAIL] ${node.hostname} - Too many ports (${node.numOpenPortsRequired})`
        );
      return;
    }

    CRACKERS.forEach((cracker) => cracker(node.hostname));

    VERBOSE && ns.print(`[SUCCESS] ${node.hostname} - Cracked successfully`);

    successCount++;
  });

  ns.print(`${successCount} nodes cracked ✅`);

  ns.spawn("fetch-nodes.js", { spawnDelay: 1000 }, VERBOSE && "--verbose");
}
