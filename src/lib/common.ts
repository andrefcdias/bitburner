import { NS } from "@ns";

export const clearTerminal = (ns: NS) =>
  ns.tprint(
    "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
  );

export const getNodeNeedsHacking = (ns: NS, host: string) => {
  const minLevel = ns.getServerMinSecurityLevel(host);
  const currentLevel = ns.getServerSecurityLevel(host);

  const needsWeaken = currentLevel > minLevel + 5;

  const { verbose } = ns.flags([["verbose", false]]);
  if (verbose && needsWeaken)
    ns.print(
      `${host} still needs security lowering.\n${minLevel} <=> ${currentLevel}`
    );

  return needsWeaken;
};

export const getNodeNeedsGrow = (ns: NS, host: string) => {
  const MARGIN_PERCENT = 75;
  const maxLevel = ns.getServerMaxMoney(host);
  const currentLevel = ns.getServerMoneyAvailable(host);
  const moneyThreshold = maxLevel * (MARGIN_PERCENT / 100);

  const needsGrowth = currentLevel < moneyThreshold;

  const { verbose } = ns.flags([["verbose", false]]);
  if (verbose && needsGrowth)
    ns.print(
      `${host} still needs growth.\n${currentLevel} <=> ${moneyThreshold} (${maxLevel})`
    );

  return needsGrowth;
};
