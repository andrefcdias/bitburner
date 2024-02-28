import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const HOME_RAM_MARGIN = 5;
  const [script] = ns.args;
  const { target, save } = ns.flags([
    ["target", "home"],
    ["save", 0],
  ]);
  const parsedTarget = target as string;
  const parsedSave = save as number;

  if (!script || typeof script !== "string") {
    ns.tprint("Please provide a script as first argument.");
    ns.exit();
  }

  const scriptCost = ns.getScriptRam(script);
  const maxRam = ns.getServerMaxRam(parsedTarget);
  const usedRam = ns.getServerUsedRam(parsedTarget) + parsedSave;
  const selfRam =
    parsedTarget === "home" ? ns.getScriptRam(ns.getScriptName()) : 0;
  const availableRam = maxRam - usedRam + selfRam;
  const threadsToUse =
    Math.floor(availableRam / scriptCost) -
    (parsedTarget === "home" ? HOME_RAM_MARGIN : 0);

  if (parsedTarget === "home")
    ns.spawn(script, { spawnDelay: 100, threads: threadsToUse });

  ns.scp(script, parsedTarget);
  ns.exec(script, parsedTarget, { threads: threadsToUse });
}
