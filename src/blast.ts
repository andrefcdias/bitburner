import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const [script, target] = ns.args;

  if (!script || typeof script !== "string") {
    ns.tprint("Please provide a script as first argument.");
    ns.exit();
  }
  if (!target || typeof target !== "string") {
    ns.tprint("Please provide a target host as second argument.");
    ns.exit();
  }

  const scriptCost = ns.getScriptRam(script);
  const maxRam = ns.getServerMaxRam("home");
  const usedRam = ns.getServerUsedRam("home");
  const selfRam = ns.getScriptRam(ns.getScriptName());
  const availableRam = maxRam - usedRam + selfRam;
  const threadsToUse = Math.floor(availableRam / scriptCost);

  ns.spawn(script, { spawnDelay: 100, threads: threadsToUse }, target);
}
