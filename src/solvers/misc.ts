// Reusing https://steamcommunity.com/sharedfiles/filedetails/?id=2712741294
const isValidIpSegment = (segment: string) => {
  if (segment[0] == "0" && segment != "0") return false;
  const numSegment = Number(segment);
  if (numSegment < 0 || numSegment > 255) return false;
  return true;
};

export const generateIPs = (data: number) => {
  const strValue = data.toString();

  const length = strValue.length;

  const ips = [];

  for (let i = 1; i < length - 2; i++) {
    for (let j = i + 1; j < length - 1; j++) {
      for (let k = j + 1; k < length; k++) {
        const ip = [
          strValue.slice(0, i),
          strValue.slice(i, j),
          strValue.slice(j, k),
          strValue.slice(k, strValue.length),
        ];
        let isValid = true;

        ip.forEach((seg) => {
          isValid = isValid && isValidIpSegment(seg);
        });

        if (isValid) ips.push(ip.join("."));
      }
    }
  }

  return ips;
};

// Reusing https://github.com/alainbryden/bitburner-scripts/blob/61739c010da8f9197c1a8ac50b2bd9ac1bb87e02/Tasks/contractor.js.solver.js#L478
export const sanitizeParentheses = (data: string) => {
  let left = 0;
  let right = 0;
  const res: string[] = [];
  for (let i = 0; i < data.length; ++i) {
    if (data[i] === "(") {
      ++left;
    } else if (data[i] === ")") {
      left > 0 ? --left : ++right;
    }
  }

  function dfs(
    pair: number,
    index: number,
    left: number,
    right: number,
    s: string,
    solution: string,
    res: string[]
  ) {
    if (s.length === index) {
      if (left === 0 && right === 0 && pair === 0) {
        for (let i = 0; i < res.length; i++) {
          if (res[i] === solution) {
            return;
          }
        }
        res.push(solution);
      }
      return;
    }
    if (s[index] === "(") {
      if (left > 0) {
        dfs(pair, index + 1, left - 1, right, s, solution, res);
      }
      dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
    } else if (s[index] === ")") {
      if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
      if (pair > 0)
        dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
    } else {
      dfs(pair, index + 1, left, right, s, solution + s[index], res);
    }
  }
  dfs(0, 0, left, right, data, "", res);

  return res;
};

// Reusing https://github.com/alainbryden/bitburner-scripts/blob/61739c010da8f9197c1a8ac50b2bd9ac1bb87e02/Tasks/contractor.js.solver.js#L639
export const colorGraph = (data: any) => {
  // convert from edges to nodes
  const nodes: any = new Array(data[0]).fill(0).map(() => []);
  for (const e of data[1]) {
    nodes[e[0]].push(e[1]);
    nodes[e[1]].push(e[0]);
  }
  // solution graph starts out undefined and fills in with 0s and 1s
  const solution: any = new Array(data[0]).fill(undefined);
  let oddCycleFound = false;
  // recursive function for DFS
  const traverse = (index: number, color: any) => {
    if (oddCycleFound) {
      // leave immediately if an invalid cycle was found
      return;
    }
    if (solution[index] === color) {
      // node was already hit and is correctly colored
      return;
    }
    if (solution[index] === (color ^ 1)) {
      // node was already hit and is incorrectly colored: graph is uncolorable
      oddCycleFound = true;
      return;
    }
    solution[index] = color;
    for (const n of nodes[index]) {
      traverse(n, color ^ 1);
    }
  };
  // repeat run for as long as undefined nodes are found, in case graph isn't fully connected
  while (!oddCycleFound && solution.some((e: any) => e === undefined)) {
    traverse(solution.indexOf(undefined), 0);
  }
  if (oddCycleFound) return "[]"; // TODO: Bug #3755 in bitburner requires a string literal. Will this be fixed?
  return solution;
};
