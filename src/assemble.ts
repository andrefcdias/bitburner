import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  let timerDelay = 3 * 60 * 1000;

  ns.exec("blast.js", "home", undefined, "prepare.js");

  while (true) {
    ns.exec("fetch-nodes.js", "home");

    await ns.sleep(3000);

    ns.exec("crack.js", "home");
    ns.exec("hack-all.js", "home");

    await ns.sleep(timerDelay);
  }
}
