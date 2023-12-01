import type { NS, Server } from "@ns";
import { saveNodes } from "./lib/nodes";

export async function main(ns: NS): Promise<void> {
  const { verbose: VERBOSE } = ns.flags([["verbose", false]]);

  ns.print("Updating node cache...");

  const scanRecursive = (target: string, parentNode?: string) => {
    const nodes = ns
      .scan(target)
      .filter((n) => n !== parentNode)
      .map(ns.getServer);

    const nodeAggregator = [...nodes];
    nodes.forEach((node) => {
      nodeAggregator.push(...scanRecursive(node.hostname, target));
    });

    return nodeAggregator;
  };

  const nodes: Server[] = scanRecursive("home");

  const nodesByHackSkill = nodes.sort(
    (a, b) => (a.requiredHackingSkill ?? 0) - (b.requiredHackingSkill ?? 0)
  );

  VERBOSE &&
    ns.print(
      nodesByHackSkill
        .map(
          (n) =>
            `Host ${n.hostname} - ${n.requiredHackingSkill} Hack - ${n.numOpenPortsRequired} Ports`
        )
        .join("\n")
    );

  ns.print("Nodes updated ✅");

  saveNodes(ns, nodesByHackSkill);
}
