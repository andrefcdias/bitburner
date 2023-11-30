import { NS, Server } from "@ns";

const NODES_FILENAME = "nodes.txt";

export const getNodes = (ns: NS): Server[] => {
  const rawData = ns.read(NODES_FILENAME);
  if (!rawData) {
    ns.print(
      `${NODES_FILENAME} does not exist. Nodes cache could not be fetched.`
    );
    ns.exit();
  }

  return JSON.parse(rawData) as Server[];
};

export const saveNodes = (ns: NS, nodes: Server[]) => {
  ns.write(NODES_FILENAME, JSON.stringify(nodes));
};
