import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { parse } from 'yaml';

/**
 * 供 loader 使用的读取工具；路径均相对于 content 目录。
 * @typedef {object} LoadUtil
 * @property {(dir: string) => Promise<string[]>} listFiles 列出目录下的 .yml 文件名，按自然序排序
 * @property {(file: string) => Promise<Record<string, any>>} readYaml 读取并解析一个 YAML 映射
 */

/**
 * 供 generator 使用的写入工具；路径均相对于 data_generated 目录。
 * @typedef {object} GenerateUtil
 * @property {(fileName: string, data: unknown) => Promise<void>} saveData 把对象序列化为 JSON 写入
 * @property {(fileName: string, raw: string) => Promise<void>} saveRaw 把纯文本写入（函数等）
 */

/**
 * 读取并解析一个 YAML 映射文件。
 * @param {string} path
 * @returns {Promise<Record<string, any>>}
 */
export async function readYamlFile(path) {
  const data = parse(await readFile(path, 'utf8'));
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`${path}: 顶层应为 YAML 映射`);
  }
  return data;
}

/**
 * @param {string} root
 * @returns {LoadUtil}
 */
export function createLoadUtil(root) {
  return {
    async listFiles(dir) {
      const files = await readdir(join(root, dir));
      return files
        .filter((file) => file.endsWith('.yml'))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    },

    async readYaml(file) {
      return readYamlFile(join(root, file));
    },
  };
}

/**
 * @param {string} root
 * @returns {GenerateUtil}
 */
export function createGenerateUtil(root) {
  /** @param {string} fileName @param {string} text */
  const save = async (fileName, text) => {
    const path = join(root, fileName);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, text, 'utf8');
  };

  return {
    async saveData(fileName, data) {
      await save(fileName, JSON.stringify(data, null, 2) + '\n');
    },

    async saveRaw(fileName, raw) {
      await save(fileName, raw);
    },
  };
}
