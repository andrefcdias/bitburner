// Reusing https://gist.github.com/OrangeDrangon/8a08d2d7d425fddd2558e1c0c5fae78b
const maxProfit = (arrayData: [number, number[]]) => {
  let i, j, k;

  let maxTrades = arrayData[0];
  let stockPrices = arrayData[1];

  // WHY?
  let tempStr = "[0";
  for (i = 0; i < stockPrices.length; i++) {
    tempStr += ",0";
  }
  tempStr += "]";
  let tempArr = "[" + tempStr;
  for (i = 0; i < maxTrades - 1; i++) {
    tempArr += "," + tempStr;
  }
  tempArr += "]";

  let highestProfit = JSON.parse(tempArr);

  for (i = 0; i < maxTrades; i++) {
    for (j = 0; j < stockPrices.length; j++) {
      // Buy / Start
      for (k = j; k < stockPrices.length; k++) {
        // Sell / End
        if (i > 0 && j > 0 && k > 0) {
          highestProfit[i][k] = Math.max(
            highestProfit[i][k],
            highestProfit[i - 1][k],
            highestProfit[i][k - 1],
            highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]
          );
        } else if (i > 0 && j > 0) {
          highestProfit[i][k] = Math.max(
            highestProfit[i][k],
            highestProfit[i - 1][k],
            highestProfit[i - 1][j - 1] + stockPrices[k] - stockPrices[j]
          );
        } else if (i > 0 && k > 0) {
          highestProfit[i][k] = Math.max(
            highestProfit[i][k],
            highestProfit[i - 1][k],
            highestProfit[i][k - 1],
            stockPrices[k] - stockPrices[j]
          );
        } else if (j > 0 && k > 0) {
          highestProfit[i][k] = Math.max(
            highestProfit[i][k],
            highestProfit[i][k - 1],
            stockPrices[k] - stockPrices[j]
          );
        } else {
          highestProfit[i][k] = Math.max(
            highestProfit[i][k],
            stockPrices[k] - stockPrices[j]
          );
        }
      }
    }
  }
  return highestProfit[maxTrades - 1][stockPrices.length - 1];
};

export const stockTraderI = (data: number[]) => maxProfit([1, data]);
export const stockTraderII = (data: number[]) =>
  maxProfit([Math.ceil(data.length / 2), data]);
export const stockTraderIII = (data: number[]) => maxProfit([2, data]);
export const stockTraderIV = (data: [number, number[]]) => maxProfit(data);
