const CHARS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

type Map<T> = { [key: string]: T };

const buildInnerCharMatrix = (offset: number) => {
  const charMap: Map<string> = {};
  const charStart = "A".charCodeAt(0);
  const charEnd = "Z".charCodeAt(0);
  for (let i = 0; i <= charEnd - charStart; i++) {
    const offsetChars = CHARS.slice(offset).concat(CHARS);
    charMap[String.fromCharCode(i + charStart)] = offsetChars[i];
  }

  return charMap;
};

const buildCharMatrix = () => {
  const matrix: Map<Map<string>> = {};
  const charStart = "A".charCodeAt(0);
  const charEnd = "Z".charCodeAt(0);
  for (let i = 0; i <= charEnd - charStart; i++) {
    matrix[String.fromCharCode(i + charStart)] = buildInnerCharMatrix(i);
  }

  return matrix;
};

export const encrypt2 = (data: string[]) => {
  const charMatrix = buildCharMatrix();
  const [word, cypher] = data;

  const matchedCypher =
    cypher.length >= word.length
      ? cypher
      : cypher.repeat(Math.ceil(word.length / cypher.length));

  let result = "";
  for (let i = 0; i < word.length; i++) {
    const wordChar = word[i];
    const cypherChar = matchedCypher[i];

    result += charMatrix[wordChar][cypherChar];
  }

  return result;
};
