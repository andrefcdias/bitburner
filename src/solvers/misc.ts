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
