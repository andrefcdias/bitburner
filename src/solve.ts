import { getNodes } from "./lib/nodes";
import type { NS } from "@ns";
import { solve } from "./solvers/solver";

export async function main(ns: NS): Promise<void> {
  const nodes = getNodes(ns);

  for (const node of nodes) {
    solve(ns, node.hostname);
  }
}
