import { NS } from "@ns";
import { encrypt2 } from "./encrypt";

export const solve = (ns: NS, hostname: string): void => {
  const contracts = ns.ls(hostname, ".cct");
  for (const contract of contracts) {
    const type = ns.codingcontract.getContractType(contract, hostname);
    const data = ns.codingcontract.getData(contract, hostname);
    ns.tprint(contract);

    let solution;
    switch (type) {
      case "Encryption II: Vigenère Cipher":
        solution = encrypt2(data);
        break;
      default:
        ns.tprint(`Unknown contract type "${type}" in ${hostname}`);
        break;
    }

    if (solution) {
      ns.tprint(type);
      ns.tprint(data);
      ns.tprint(solution);
      const result = ns.codingcontract.attempt(solution, contract, hostname);
      ns.tprint(result);
    }
  }
};
