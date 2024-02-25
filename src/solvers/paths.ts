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
