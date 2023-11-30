import type { NS, Server } from "@ns";
import { saveNodes } from "./lib/nodes";

type ExtendedServer = {
  nodes?: ExtendedServer[];
} & Server;

export async function main(ns: NS): Promise<void> {
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

  const nodes: ExtendedServer[] = scanRecursive("home");

  const nodesByHackSkill = nodes.sort(
    (a, b) => (a.requiredHackingSkill ?? 0) - (b.requiredHackingSkill ?? 0)
  );

  ns.tprint(
    nodesByHackSkill
      .map(
        (n) =>
          `Host ${n.hostname} - ${n.requiredHackingSkill} Hack - ${n.numOpenPortsRequired} Ports`
      )
      .join("\n")
  );

  saveNodes(ns, nodesByHackSkill);
}
