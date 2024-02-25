// Reusing https://steamcommunity.com/sharedfiles/filedetails/?id=2712741294
export const largestFactor = (num: number): number => {
  for (let div = 2; div <= Math.sqrt(num); div++) {
    if (num % div != 0) {
      continue;
    }
    num = num / div;
    div = 1;
  }
  return num;
};

const column = (arr: number[][], index: number) => {
  const res = [];
  for (let i = 0; i < arr.length; i++) {
    const elm = arr[i].splice(index, 1)[0];
    if (elm) {
      res.push(elm);
    }
  }
  return res;
};

export const spiralizeMatrix = (
  data: number[][],
  acc: number[] = []
): any[] => {
  if (data.length === 0 || data[0].length === 0) {
    return acc;
  }
  acc = acc.concat(data.shift()!);
  if (data.length === 0 || data[0].length === 0) {
    return acc;
  }
  acc = acc.concat(column(data, data[0].length - 1));
  if (data.length === 0 || data[0].length === 0) {
    return acc;
  }
  acc = acc.concat(data.pop()!.reverse());
  if (data.length === 0 || data[0].length === 0) {
    return acc;
  }
  acc = acc.concat(column(data, 0).reverse());
  if (data.length === 0 || data[0].length === 0) {
    return acc;
  }
  return spiralizeMatrix(data, acc);
};

export const mergeOverlap = (data: number[][]): number[][] => {
  data.sort(([minA], [minB]) => minA - minB);
  for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
      const [min, max] = data[i];
      const [laterMin, laterMax] = data[j];
      if (laterMin <= max) {
        const newMax = laterMax > max ? laterMax : max;
        const newInterval = [min, newMax];
        data[i] = newInterval;
        data.splice(j, 1);
        j = i;
      }
    }
  }
  return data;
};

const totalSumRecurse = (limit: number, n: number, cache: any): number => {
  if (n < 1) {
    return 1;
  }
  if (limit == 1) {
    return 1;
  }
  if (n < limit) {
    return totalSumRecurse(n, n, cache);
  }
  if (n in cache) {
    var c = cache[n];
    if (limit in c) {
      return c[limit];
    }
  }
  var s = 0;
  for (var i = 1; i <= limit; i++) {
    s += totalSumRecurse(i, n - i, cache);
  }
  if (!(n in cache)) {
    cache[n] = {};
  }
  cache[n][limit] = s;
  return s;
};

export const totalSum = (data: number) => totalSumRecurse(data, data, {}) - 1;

// Reusing https://www.reddit.com/r/Bitburner/comments/114j6k7/contract_solvers/
export const totalSumII = (data: [number, number[]]) => {
  const n = data[0];
  const s = data[1];
  const ways = [1];
  ways.length = n + 1;
  ways.fill(0, 1);
  for (let i = 0; i < s.length; i++) {
    for (let j = s[i]; j <= n; j++) {
      ways[j] += ways[j - s[i]];
    }
  }
  return ways[n];
};

const findMathExpr = (s: string, n: string, expr: string): string[] => {
  if (s.length == 0) {
    if (eval(expr) == n) {
      return [expr];
    } else {
      return [];
    }
  }

  var results: string[] = [];
  if (s.startsWith("0")) {
    var sliced = s.slice(1);
    if (expr.length == 0) {
      return findMathExpr(sliced, n, expr + "0");
    }
    results = results.concat(
      findMathExpr(sliced, n, expr + "+0"),
      findMathExpr(sliced, n, expr + "-0"),
      findMathExpr(sliced, n, expr + "*0")
    );
    return results;
  }

  var maxLength = s.length;
  var ops = [];
  if (expr.length == 0) {
    ops = ["", "-"];
  } else {
    ops = ["-", "+", "*"];
  }
  for (var op of ops) {
    for (var i = 1; i <= maxLength; i++) {
      results = results.concat(
        findMathExpr(s.slice(i), n, expr + op + s.slice(0, i))
      );
    }
  }
  return results;
};

export const findAllValidMathExpr = (data: string[]) => {
  const [s, n] = data;
  return findMathExpr(s, n, "");
};

export const subarrayWithMaxSum = (data: number[]): number => {
  if (data.length == 0) {
    return 0;
  }
  if (data.length == 1) {
    return data[0];
  }
  var sum = subarrayWithMaxSum(data.slice(1));
  var s = 0;
  for (var i = 0; i < data.length; i++) {
    s += data[i];
    if (s > sum) {
      sum = s;
    }
  }
  return sum;
};
