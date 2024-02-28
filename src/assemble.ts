import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  let timerDelay = 3 * 60 * 1000;
  const scripts = ["solve.js", "crack.js", "hack-all.js"];

  let maxCost = 0;
  for (const script of scripts) {
    maxCost = Math.max(ns.getScriptRam(script), maxCost);
  }

  ns.exec("blast.js", "home", undefined, "prepare.js", "--save", maxCost);

  while (true) {
    ns.exec("fetch-nodes.js", "home");

    await ns.sleep(3000);

    for (const script of scripts) {
      ns.exec(script, "home");
    }

    await ns.sleep(timerDelay);
  }
}
