import type { NS, Server } from "@ns";

type ServerTree = {
  nodes: ServerTree[];
} & Server;

export async function main(ns: NS): Promise<void> {
  const { target } = ns.flags([["target", ""]]);
  const parsedTarget = target ? (target as string) : null;

  const scanRecursive = (target: string, parentNode?: string): ServerTree => ({
    ...ns.getServer(target),
    nodes: ns
      .scan(target)
      .filter((host) => host !== parentNode)
      .map((host) => scanRecursive(host, target)),
  });

  const serverTree = scanRecursive("home");

  const getPrintRecursive = (serverTree: ServerTree, depth = 0) => {
    let printOutput = `${"  ".repeat(depth)}${serverTree.hostname}\n`;

    serverTree.nodes.forEach((server) => {
      printOutput += getPrintRecursive(server, depth + 1);
    });

    return printOutput;
  };

  const printServerTree = (serverTree: ServerTree) => {
    ns.tprint(`\n\n${getPrintRecursive(serverTree)}`);
  };

  const fetchPathRecursive = (serverTree: ServerTree): string | undefined => {
    if (serverTree.hostname === parsedTarget) {
      return serverTree.hostname;
    }

    for (const node of serverTree.nodes) {
      const path = fetchPathRecursive(node);

      if (path) {
        return `${serverTree.hostname} -> ${path}`;
      }
    }

    return undefined;
  };

  if (!parsedTarget) {
    printServerTree(serverTree);
    ns.exit();
  }

  const path = fetchPathRecursive(serverTree);
  if (!path) {
    ns.tprint(`${parsedTarget} not found in network`);
  }

  ns.tprint(path);
}
