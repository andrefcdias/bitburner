import type { NS, Server } from "@ns";

type ServerTree = {
  nodes: ServerTree[];
} & Server;

const color = {
  black: "\u001b[30m",
  red: "\u001b[31m",
  green: "\u001b[32m",
  yellow: "\u001b[33m",
  blue: "\u001b[34m",
  magenta: "\u001b[35m",
  cyan: "\u001b[36m",
  white: "\u001b[37m",
  brightBlack: "\u001b[30;1m",
  brightRed: "\u001b[31;1m",
  brightGreen: "\u001b[32;1m",
  brightYellow: "\u001b[33;1m",
  brightBlue: "\u001b[34;1m",
  brightMagenta: "\u001b[35;1m",
  brightCyan: "\u001b[36;1m",
  brightWhite: "\u001b[37;1m",
  reset: "\u001b[0m",
};

export async function main(ns: NS): Promise<void> {
  const { target, analyze } = ns.flags([
    ["target", ""],
    ["analyze", false],
  ]);
  const parsedTarget = target ? (target as string) : null;
  const parsedAnalyze = analyze ? (analyze as string) : null;

  const humanizeMoney = (money: number) => {
    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc"];
    let suffixIndex = 0;
    while (money >= 1000) {
      money /= 1000;
      suffixIndex++;
    }
    return `${money.toFixed(2)}${suffixes[suffixIndex]}`;
  };

  const getAnalyzeServerRows = (server: Server) => {
    return [
      `Required hack: ${server.requiredHackingSkill}`,
      `Difficulty: ${Math.round(server.hackDifficulty || 0)}`,
      `Money: $${humanizeMoney(server.moneyAvailable || 0)}`,
    ];
  };

  const scanRecursive = (target: string, parentNode?: string): ServerTree => ({
    ...ns.getServer(target),
    nodes: ns
      .scan(target)
      .filter((host) => host !== parentNode)
      .map((host) => scanRecursive(host, target)),
  });

  const getPrintNode = (
    content: string,
    prefix?: string,
    lastNode?: boolean,
    header?: boolean
  ) => {
    let padder = "";

    if (header) {
      if (lastNode) {
        padder += `┗ `;
      } else {
        padder += `┣ `;
      }
      padder += parsedAnalyze ? color.brightCyan : "";
    } else {
      if (lastNode) {
        padder += `   `;
      } else {
        padder += `┃ `;
      }
    }

    return `${prefix || ""}${padder} ${content}${color.reset}\n`;
  };

  const getPrintRecursive = (
    serverTree: ServerTree,
    prefix?: string,
    lastNode = false
  ) => {
    const lastOrHome = lastNode || serverTree.hostname === "home";
    const padder = lastOrHome ? "   " : "┃ ";
    let printOutput = getPrintNode(
      serverTree.hostname,
      prefix,
      lastOrHome,
      true
    );

    if (parsedAnalyze) {
      let analyzeOutput = "";
      const analyzeRows = getAnalyzeServerRows(serverTree);

      for (const row of analyzeRows) {
        analyzeOutput += getPrintNode(row, prefix, lastOrHome);
      }

      printOutput += analyzeOutput;
    }

    serverTree.nodes.forEach((server, i) => {
      const isLastNode = i === serverTree.nodes.length - 1;

      const newPrefix = `${prefix || ""}${padder}`;
      printOutput += getPrintRecursive(server, newPrefix, isLastNode);
    });

    return printOutput;
  };

  const printServerTree = (serverTree: ServerTree) => {
    ns.tprint(`\n\n${getPrintRecursive(serverTree)}`);
  };

  const fetchPathRecursive = (serverTree: ServerTree): string | undefined => {
    if (serverTree.hostname === parsedTarget) {
      return `${color.green}${serverTree.hostname}${color.reset}`;
    }

    for (const node of serverTree.nodes) {
      const path = fetchPathRecursive(node);

      if (path) {
        return `${serverTree.hostname} -> ${path}`;
      }
    }

    return undefined;
  };

  const printTargetPath = (serverTree: ServerTree) => {
    let output = fetchPathRecursive(serverTree);

    if (!output) {
      ns.tprint(`${parsedTarget} not found in network`);
    }

    if (parsedAnalyze) {
      output = `\n\n${output}`;

      output += `\n\n${color.brightCyan}${parsedTarget}${color.reset}`;

      for (const analyzeRow of getAnalyzeServerRows(serverTree)) {
        output += `\n${analyzeRow}`;
      }

      output += `\n\n`;
    }

    ns.tprint(output);
  };

  const serverTree = scanRecursive("home");

  if (!parsedTarget) {
    printServerTree(serverTree);
    ns.exit();
  }

  printTargetPath(serverTree);
}
