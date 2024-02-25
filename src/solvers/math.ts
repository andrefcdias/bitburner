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
