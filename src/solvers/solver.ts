import { NS } from "@ns";
import { encrypt2 } from "./encrypt";
import {
  stockTraderI,
  stockTraderII,
  stockTraderIII,
  stockTraderIV,
} from "./stock-trade";
import {
  arrayJumpingGame,
  shortestPath,
  triangleSum,
  uniquePathsI,
  uniquePathsII,
} from "./paths";
import { generateIPs } from "./misc";
import {
  findAllValidMathExpr,
  largestFactor,
  mergeOverlap,
  spiralizeMatrix,
  subarrayWithMaxSum,
  totalSum,
  totalSumII,
} from "./math";

type ContractSolver = (data: any) => any;
export const SUPPORTED_CONTRACTS: { [key: string]: ContractSolver } = {
  "Algorithmic Stock Trader I": stockTraderI,
  "Algorithmic Stock Trader II": stockTraderII,
  "Algorithmic Stock Trader III": stockTraderIII,
  "Algorithmic Stock Trader IV": stockTraderIV,
  "Array Jumping Game": arrayJumpingGame,
  "Encryption II: Vigenère Cipher": encrypt2,
  // Slow and broken
  // "Find All Valid Math Expressions": findAllValidMathExpr,
  "Find Largest Prime Factor": largestFactor,
  "Generate IP Addresses": generateIPs,
  "Merge Overlapping Intervals": mergeOverlap,
  "Minimum Path Sum in a Triangle": triangleSum,
  "Shortest Path in a Grid": shortestPath,
  "Spiralize Matrix": spiralizeMatrix,
  "Subarray with Maximum Sum": subarrayWithMaxSum,
  "Total Ways to Sum": totalSum,
  "Total Ways to Sum II": totalSumII,
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
