import { NS } from "@ns";
import { encrypt2 } from "./encrypt";

type ContractSolver = (data: any) => string;
export const SUPPORTED_CONTRACTS: { [key: string]: ContractSolver } = {
  "Encryption II: Vigenère Cipher": encrypt2,
};

export const solve = (ns: NS, hostname: string): void => {
  const contracts = ns.ls(hostname, ".cct");
  for (const contract of contracts) {
    const type = ns.codingcontract.getContractType(contract, hostname);
    const data = ns.codingcontract.getData(contract, hostname);

    const solver = SUPPORTED_CONTRACTS[type];
    if (!solver) {
      //   ns.tprint(`Unknown contract type "${type}" in ${hostname}`);
      continue;
    }

    const solution = solver(data);
    const result = ns.codingcontract.attempt(solution, contract, hostname);
    ns.tprint(result);
  }
};
