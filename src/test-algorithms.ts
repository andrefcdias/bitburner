import type { NS } from "@ns";
import { solve } from "./solvers/solver";

export async function main(ns: NS): Promise<void> {
  const contractTypes = ns.codingcontract.getContractTypes();
  for (const contractType of contractTypes) {
    ns.codingcontract.createDummyContract(contractType);
  }

  solve(ns, "home");

  const files = ns.ls("home");
  for (const file of files) {
    if (!file.includes(".cct")) continue;

    ns.rm(file, "home");
  }
}
