// Reusing https://github.com/alainbryden/bitburner-scripts/blob/61739c010da8f9197c1a8ac50b2bd9ac1bb87e02/Tasks/contractor.js.solver.js#L679
export const compressI = (data: string) => {
  //original code doesn't generate an answer, but validates it, fallback to this one-liner
  return data.replace(/([\w])\1{0,8}/g, (group, chr) => group.length + chr);
};

// Reusing https://github.com/alainbryden/bitburner-scripts/blob/61739c010da8f9197c1a8ac50b2bd9ac1bb87e02/Tasks/contractor.js.solver.js#L686
export const compressII = (data: string) => {
  let plain = "";

  for (let i = 0; i < data.length; ) {
    const literal_length = data.charCodeAt(i) - 0x30;

    if (
      literal_length < 0 ||
      literal_length > 9 ||
      i + 1 + literal_length > data.length
    ) {
      return null;
    }

    plain += data.substring(i + 1, i + 1 + literal_length);
    i += 1 + literal_length;

    if (i >= data.length) {
      break;
    }
    const backref_length = data.charCodeAt(i) - 0x30;

    if (backref_length < 0 || backref_length > 9) {
      return null;
    } else if (backref_length === 0) {
      ++i;
    } else {
      if (i + 1 >= data.length) {
        return null;
      }

      const backref_offset = data.charCodeAt(i + 1) - 0x30;
      if (
        (backref_length > 0 && (backref_offset < 1 || backref_offset > 9)) ||
        backref_offset > plain.length
      ) {
        return null;
      }

      for (let j = 0; j < backref_length; ++j) {
        plain += plain[plain.length - backref_offset];
      }

      i += 2;
    }
  }

  return plain;
};

// Reusing https://github.com/alainbryden/bitburner-scripts/blob/61739c010da8f9197c1a8ac50b2bd9ac1bb87e02/Tasks/contractor.js.solver.js#L731
export const compressIII = (data: string) => {
  let cur_state = Array.from(Array(10), () => Array(10).fill(null));
  let new_state = Array.from(Array(10), () => Array(10));

  function set(state: string[][], i: number, j: number, str: string) {
    const current = state[i][j];
    if (current == null || str.length < current.length) {
      state[i][j] = str;
    } else if (str.length === current.length && Math.random() < 0.5) {
      // if two strings are the same length, pick randomly so that
      // we generate more possible inputs to Compression II
      state[i][j] = str;
    }
  }

  // initial state is a literal of length 1
  cur_state[0][1] = "";

  for (let i = 1; i < data.length; ++i) {
    for (const row of new_state) {
      row.fill(null);
    }
    const c = data[i];

    // handle literals
    for (let length = 1; length <= 9; ++length) {
      const string = cur_state[0][length];
      if (string == null) {
        continue;
      }

      if (length < 9) {
        // extend current literal
        set(new_state, 0, length + 1, string);
      } else {
        // start new literal
        set(new_state, 0, 1, string + "9" + data.substring(i - 9, i) + "0");
      }

      for (let offset = 1; offset <= Math.min(9, i); ++offset) {
        if (data[i - offset] === c) {
          // start new backreference
          set(
            new_state,
            offset,
            1,
            string + length + data.substring(i - length, i)
          );
        }
      }
    }

    // handle backreferences
    for (let offset = 1; offset <= 9; ++offset) {
      for (let length = 1; length <= 9; ++length) {
        const string = cur_state[offset][length];
        if (string == null) {
          continue;
        }

        if (data[i - offset] === c) {
          if (length < 9) {
            // extend current backreference
            set(new_state, offset, length + 1, string);
          } else {
            // start new backreference
            set(new_state, offset, 1, string + "9" + offset + "0");
          }
        }

        // start new literal
        set(new_state, 0, 1, string + length + offset);

        // end current backreference and start new backreference
        for (let new_offset = 1; new_offset <= Math.min(9, i); ++new_offset) {
          if (data[i - new_offset] === c) {
            set(new_state, new_offset, 1, string + length + offset + "0");
          }
        }
      }
    }

    const tmp_state = new_state;
    new_state = cur_state;
    cur_state = tmp_state;
  }

  let result = null;

  for (let len = 1; len <= 9; ++len) {
    let string = cur_state[0][len];
    if (string == null) {
      continue;
    }

    string += len + data.substring(data.length - len, data.length);
    if (result == null || string.length < result.length) {
      result = string;
    } else if (string.length == result.length && Math.random() < 0.5) {
      result = string;
    }
  }

  for (let offset = 1; offset <= 9; ++offset) {
    for (let len = 1; len <= 9; ++len) {
      let string = cur_state[offset][len];
      if (string == null) {
        continue;
      }

      string += len + "" + offset;
      if (result == null || string.length < result.length) {
        result = string;
      } else if (string.length == result.length && Math.random() < 0.5) {
        result = string;
      }
    }
  }

  return result ?? "";
};
