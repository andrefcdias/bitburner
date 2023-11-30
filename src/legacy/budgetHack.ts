import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  if (ns.args.length != 1) {
    ns.print(`Wrong number of args provided, needs only hostname`);
    ns.print(`Args: ${ns.args.join(" ")}`);
  }

  const hostname = ns.args[0];

  if (!hostname || typeof hostname !== "string") {
    ns.print("No targed provided");
    ns.exit();
  }

  while (true) {
    await ns.grow(hostname);
    await ns.hack(hostname);
  }
}
