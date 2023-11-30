import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const [target, script] = ns.args;

  if (!target || typeof target !== "string") {
    ns.print("No server picked");
    ns.exit();
  }
  if (!script || typeof script !== "string") {
    ns.print("No script picked");
    ns.exit();
  }

  const targetServer = ns.getServer(target);

  ns.killall(targetServer.hostname);
  ns.scp(script, targetServer.hostname);

  const maxRam = ns.getServerMaxRam(targetServer.hostname);
  const usedRam = ns.getServerUsedRam(targetServer.hostname);
  const availableRam = maxRam - usedRam;
  ns.print(`Available RAM: ${availableRam}`);

  const scriptRamCost = ns.getScriptRam(script, targetServer.hostname);
  ns.print(`${script} costs ${scriptRamCost}`);

  const threadsToUse = Math.floor(availableRam / scriptRamCost);
  ns.print(`Threads to use: ${threadsToUse}`);

  ns.exec(
    script,
    targetServer.hostname,
    { threads: threadsToUse },
    threadsToUse
  );
}
