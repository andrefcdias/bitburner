import { NS } from "@ns";
import { encrypt2 } from "./encrypt";
import {
  stockTraderI,
  stockTraderII,
  stockTraderIII,
  stockTraderIV,
} from "./stock-trade";
import { triangleSum, uniquePathsI, uniquePathsII } from "./paths";
import { generateIPs } from "./misc";

type ContractSolver = (data: any) => any;
export const SUPPORTED_CONTRACTS: { [key: string]: ContractSolver } = {
  "Algorithmic Stock Trader I": stockTraderI,
  "Algorithmic Stock Trader II": stockTraderII,
  "Algorithmic Stock Trader III": stockTraderIII,
  "Algorithmic Stock Trader IV": stockTraderIV,
  "Encryption II: Vigenère Cipher": encrypt2,
  "Generate IP Addresses": generateIPs,
  "Minimum Path Sum in a Triangle": triangleSum,
  "Unique Paths in a Grid I": uniquePathsI,
  "Unique Paths in a Grid II": uniquePathsII,
};

export const solve = (ns: NS, hostname: string): void => {
  const contracts = ns.ls(hostname, ".cct");
  for (const contract of contracts) {
    const type = ns.codingcontract.getContractType(contract, hostname);
    const data = ns.codingcontract.getData(contract, hostname);

    const solver = SUPPORTED_CONTRACTS[type];
    if (!solver) {
      ns.tprint(`Unknown contract (${contract}) type "${type}" in ${hostname}`);
      continue;
    }

    ns.tprint(`Solving a ${type} (${contract}) contract with the data ${data}`);

    const solution = solver(data);
    const result = ns.codingcontract.attempt(solution, contract, hostname);
    ns.tprint(result);
  }
};
