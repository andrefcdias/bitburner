import { getNodes } from "./lib/nodes";
import { encrypt2 } from "./solvers/encrypt";
import type { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const nodes = getNodes(ns);

  for (const node of nodes) {
    const contracts = ns.ls(node.hostname, ".cct");
    for (const contract of contracts) {
      const type = ns.codingcontract.getContractType(contract, node.hostname);
      const data = ns.codingcontract.getData(contract, node.hostname);

      let solution;
      switch (type) {
        case "Encryption II: Vigenère Cipher":
          solution = encrypt2(data);
          ns.tprint(JSON.stringify(solution));
          break;
        default:
          ns.tprint(`Unknown contract type "${type}" in ${node.hostname}`);
          break;
      }

      if (solution) {
        ns.codingcontract.attempt(solution, contract, node.hostname);
      }
    }
  }
}
