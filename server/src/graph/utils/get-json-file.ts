import { readFile } from 'fs/promises';

export async function getJsonFile<T>(filePath: string): Promise<T> {
  return readFile(filePath, { encoding: 'utf8' }).then(JSON.parse);
}
