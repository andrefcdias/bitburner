import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const [threadsToUse] = ns.args;
  if (!threadsToUse || typeof threadsToUse !== "number") {
    ns.print("No thread count provided.");
    ns.exit();
  }

  const hostname = ns.getHostname();
  const minSecLevel = ns.getServerMinSecurityLevel(hostname);

  await ns.sleep(3000);

  while (true) {
    const secLevel = ns.getServerSecurityLevel(hostname);
    if (secLevel < minSecLevel + threadsToUse * 0.05) {
      ns.print(`Cop has arrested ${hostname}! >:)`);
      ns.alert(`Cop has arrested ${hostname}! >:)`);
      ns.exit();
    }

    await ns.weaken(hostname);
  }
}
