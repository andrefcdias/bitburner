import type { NS, Server } from "@ns";

type ServerTree = {
  nodes: ServerTree[];
} & Server;

export async function main(ns: NS): Promise<void> {
  const scanRecursive = (target: string, parentNode?: string): ServerTree => ({
    ...ns.getServer(target),
    nodes: ns
      .scan(target)
      .filter((host) => host !== parentNode)
      .map((host) => scanRecursive(host, target)),
  });

  const serverTree = scanRecursive("home");

  const printRecursive = (serverTree: ServerTree, depth = 0) => {
    ns.tprint(`${" ".repeat(depth)}${serverTree.hostname}`);
    serverTree.nodes.forEach((server) => {
      printRecursive(server, depth + 1);
    });
  };

  printRecursive(serverTree);
}
