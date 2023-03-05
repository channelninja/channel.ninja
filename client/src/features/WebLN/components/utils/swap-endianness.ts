export const swapEndianness = (string: string) => {
  const result = [];
  let len = string.length - 2;

  while (len >= 0) {
    result.push(string.substring(len, len + 2));
    len -= 2;
  }
  return result.join('');
};
