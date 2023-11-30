import type { NS } from "@ns";

type HeaderWrapper = (func: () => Promise<void>, name: string) => Promise<void>;

export async function main(ns: NS): Promise<void> {
  const [threadArg] = ns.args;
  const threads = typeof threadArg == "number" ? threadArg : 1;

  const wrapInHeader: HeaderWrapper = async (func, name) => {
    ns.print("");
    ns.print(`=== ${name} ===`);
    ns.print("");
    await func();
    ns.print("");
    ns.print(`=== ${name} ===`);
    ns.print("");
  };

  const hostname = ns.getHostname();
  const minSecLevel = ns.getServerMinSecurityLevel(hostname);

  const hitSec = async () => {
    const secLevel = ns.getServerSecurityLevel(hostname);
    ns.print(`SecLevel: ${secLevel}`);

    if (secLevel > 25) {
      ns.alert(`SecLevel is at ${secLevel} for ${hostname}`);
    }

    const weakenEffect = threads * 0.05;
    const secLevelDiff = secLevel - weakenEffect;
    if (secLevelDiff >= minSecLevel) {
      await ns.weaken(hostname);
    }
  };

  const hitMoney = async () => {
    await ns.grow(hostname);
    await ns.hack(hostname);
  };

  while (true) {
    await wrapInHeader(hitSec, "SecLevel");
    await wrapInHeader(hitMoney, "Hacking");
  }
}
