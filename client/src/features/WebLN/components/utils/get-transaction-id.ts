import { Buffer } from 'buffer';

const swapEndianness = (string: string) => {
  const result = [];
  let len = string.length - 2;

  while (len >= 0) {
    result.push(string.substring(len, len + 2));
    len -= 2;
  }
  return result.join('');
};

export const getTransactionId = (transactionIdBytes: string): string => {
  const buffer = Buffer.from(transactionIdBytes, 'base64');
  const hex = buffer.toString('hex');
  const transactionId = swapEndianness(hex);

  return transactionId;
};
