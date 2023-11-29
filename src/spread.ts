import type { NS, Server } from "@ns";

export async function main(ns: NS): Promise<void> {
  const [script] = ns.args;
  if (!script || typeof script !== "string") {
    ns.print("[ERROR] Pass a script to run as an argument.");
    ns.exit();
  }

  const LOW_SPEC_HACKER = "tinyMessenger.js";
  const PLAYER = ns.getPlayer();
  const PLAYER_SKILL = PLAYER.skills.hacking;
  const SCRIPT_NAME = ns.getScriptName();
  const SCRIPT_SELF_COST = ns.getScriptRam(SCRIPT_NAME);
  const CURRENT_NODE = ns.getHostname();
  const scriptCost = ns.getScriptRam(script);

  ns.print(" ");
  ns.print(`Running ${SCRIPT_NAME} on ${CURRENT_NODE}, look alive!`);
  await ns.sleep(3000);
  ns.print(" ");

  const CRACKERS = [
    {
      name: "relaySMTP.exe",
      exec: ns.relaysmtp,
    },
    {
      name: "BruteSSH.exe",
      exec: ns.brutessh,
    },
    {
      name: "NUKE.exe",
      exec: ns.nuke,
    },
  ];

  const crackHost = (node: Server) => {
    ns.print(
      `Host ${node.hostname} requires ${node.requiredHackingSkill} to crack`
    );

    ns.print(`Skill required: ${node.requiredHackingSkill}`);
    if (node.requiredHackingSkill ?? 0 > PLAYER_SKILL) {
      ns.print("Would not crack!");
      return false;
    }

    if (!node.numOpenPortsRequired) {
      ns.print(`Could not fetch open ports??? ${node.numOpenPortsRequired}`);
      return false;
    }
    if (node.numOpenPortsRequired ?? 0 > CRACKERS.length - 1) {
      ns.print(
        `Not enough crackers available, requires ${node.numOpenPortsRequired}`
      );
      return false;
    }

    CRACKERS.forEach((crack) => {
      ns.print(`Cracking with: ${crack.name}`);
      crack.exec(node.hostname);
    });

    return true;
  };

  ns.print("Scanning near nodes...");

  ns.scan(CURRENT_NODE)
    .filter((node) => node != "home" && node != "darkweb")
    .reverse()
    .map(ns.getServer)
    .forEach((node) => {
      ns.print(" ");
      // ns.killall(node.hostname, true)

      if (node.maxRam < SCRIPT_SELF_COST) {
        ns.print(`${node.hostname} only has ${node.maxRam}`);
        return;
      }

      if (!ns.hasRootAccess(node.hostname)) {
        if (!crackHost(node)) {
          ns.print(`Failed to crack ${node.hostname}.`);
          return;
        }
      } else ns.print(`${node.hostname} was already cracked.`);

      ns.print(
        `Copying ${SCRIPT_NAME} from ${CURRENT_NODE} to ${node.hostname}`
      );
      ns.scp(script, node.hostname);
      ns.scp(SCRIPT_NAME, node.hostname);
      ns.exec(SCRIPT_NAME, node.hostname, { threads: 1 }, script);
    });

  if (CURRENT_NODE === "home") {
    ns.exit();
  }

  const currentNode = ns.getServer(CURRENT_NODE);

  if (!currentNode.moneyAvailable) {
    ns.print(`No money sadge, bye.`);
    ns.exit();
  }

  const availableRam =
    currentNode.maxRam - (currentNode.ramUsed - SCRIPT_SELF_COST);
  ns.print(`Available RAM: ${availableRam}`);

  if (availableRam < scriptCost) {
    ns.print(`[ERROR] Machine too busy, sending a tinyMessenger and praying`);
    // ns.scp(LOW_SPEC_HACKER,)

    ns.exit();
  }

  const threadsToUse = Math.floor(availableRam / scriptCost);
  ns.print(`Threads to use: ${threadsToUse}`);

  ns.spawn(script, { threads: threadsToUse, spawnDelay: 3000 }, threadsToUse);
}
