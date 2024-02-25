// Reusing https://steamcommunity.com/sharedfiles/filedetails/?id=2712741294
const factorialDivision = (n: number, d: number): number => {
  if (n == 0 || n == 1 || n == d) return 1;
  return factorialDivision(n - 1, d) * n;
};

const factorial = (n: number): number => {
  return factorialDivision(n, 1);
};

export const uniquePathsI = (data: number[]): number => {
  const rightMoves = data[0] - 1;
  const downMoves = data[1] - 1;

  return Math.round(
    factorialDivision(rightMoves + downMoves, rightMoves) / factorial(downMoves)
  );
};

export const uniquePathsII = (
  data: number[][],
  ignoreFirst = false,
  ignoreLast = false
) => {
  const rightMoves = data[0].length - 1;
  const downMoves = data.length - 1;

  let totalPossiblePaths = Math.round(
    factorialDivision(rightMoves + downMoves, rightMoves) / factorial(downMoves)
  );

  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      if (
        data[i][j] == 1 &&
        (!ignoreFirst || i != 0 || j != 0) &&
        (!ignoreLast || i != data.length - 1 || j != data[i].length - 1)
      ) {
        const newArray = [];
        for (let k = i; k < data.length; k++) {
          newArray.push(data[k].slice(j, data[i].length));
        }

        let removedPaths = uniquePathsII(newArray, true, ignoreLast);
        removedPaths *= uniquePathsI([i + 1, j + 1]);

        totalPossiblePaths -= removedPaths;
      }
    }
  }

  return totalPossiblePaths;
};

export const triangleSum = (data: number[][]) => {
  let triangle = data;
  let nextArray: number[] = [];
  let previousArray = triangle[0];

  for (let i = 1; i < triangle.length; i++) {
    nextArray = [];
    for (let j = 0; j < triangle[i].length; j++) {
      if (j == 0) {
        nextArray.push(previousArray[j] + triangle[i][j]);
      } else if (j == triangle[i].length - 1) {
        nextArray.push(previousArray[j - 1] + triangle[i][j]);
      } else {
        nextArray.push(
          Math.min(previousArray[j], previousArray[j - 1]) + triangle[i][j]
        );
      }
    }

    previousArray = nextArray;
  }

  return Math.min.apply(null, nextArray);
};

const findJump = (data: number[], pos: number) => {
  var maxJump = data[pos];
  if (pos + maxJump >= data.length - 1) {
    return 1;
  }
  for (var i = 1; i <= maxJump; i++) {
    if (findJump(data, pos + i) == 1) {
      return 1;
    }
  }
  return 0;
};

export const arrayJumpingGame = (data: number[]) => {
  return findJump(data, 0);
};

// Reusing https://github.com/alainbryden/bitburner-scripts/blob/61739c010da8f9197c1a8ac50b2bd9ac1bb87e02/Tasks/contractor.js.solver.js#L188
export const arrayJumpingGameII = (data: number[]) => {
  if (data[0] == 0) return "0";
  const n = data.length;
  let reach = 0;
  let jumps = 0;
  let lastJump = -1;
  while (reach < n - 1) {
    let jumpedFrom = -1;
    for (let i = reach; i > lastJump; i--) {
      if (i + data[i] > reach) {
        reach = i + data[i];
        jumpedFrom = i;
      }
    }
    if (jumpedFrom === -1) {
      jumps = 0;
      break;
    }
    lastJump = jumpedFrom;
    jumps++;
  }
  return jumps;
};

// Reusing https://github.com/alainbryden/bitburner-scripts/pull/86/commits/fdc922c6687f7148048615cbddc0758eb389e60e#diff-e93a4b940ba5f8e16816bf5d52a771d01690b3ae70b7742310fc3a08afdbfd3bR380
export const shortestPath = (data: number[][]): string => {
  const width = data[0].length;
  const height = data.length;
  const dstY = height - 1;
  const dstX = width - 1;

  const distance = new Array(height);
  const queue: number[][] = [];

  for (let y = 0; y < height; y++) {
    distance[y] = new Array(width).fill(Infinity);
  }

  function validPosition(y: number, x: number) {
    return y >= 0 && y < height && x >= 0 && x < width && data[y][x] == 0;
  }

  function* neighbors(y: number, x: number) {
    if (validPosition(y - 1, x)) yield [y - 1, x];
    if (validPosition(y + 1, x)) yield [y + 1, x];
    if (validPosition(y, x - 1)) yield [y, x - 1];
    if (validPosition(y, x + 1)) yield [y, x + 1];
  }

  distance[0][0] = 0;
  queue.push([0, 0]);
  while (queue.length > 0) {
    const [y, x] = queue.shift()!;
    for (const [yN, xN] of neighbors(y, x)) {
      const d = distance[y][x] + 1;
      if (distance[yN][xN] == Infinity) {
        queue.push([yN, xN]);
        distance[yN][xN] = d;
      }
    }
  }
  if (distance[dstY][dstX] == Infinity) return "";
  let path = "";
  let [yC, xC] = [dstY, dstX];
  while (xC != 0 || yC != 0) {
    const dist = distance[yC][xC];
    for (const [yF, xF] of neighbors(yC, xC)) {
      if (distance[yF][xF] == dist - 1) {
        path =
          (xC == xF ? (yC == yF + 1 ? "D" : "U") : xC == xF + 1 ? "R" : "L") +
          path;
        [yC, xC] = [yF, xF];
        break;
      }
    }
  }

  return path;
};
