import { createWriteStream } from 'node:fs';
import { copyFile, mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ZipArchive } from 'archiver';
import { generate } from './generate.js';
import { load } from './load.js';
import { createGenerateUtil, createLoadUtil, readYamlFile } from './util/io.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const contentDir = join(root, 'content');
const generatedDir = join(root, 'data_generated');
const dataDir = join(root, 'data');
const distDir = join(root, 'dist');

// —— 构建配置 ——
const build = await readYamlFile(join(root, 'build.yml'));
const outputName = renderTemplate(build.outputName, build);
console.log(`构建 ${build.name} ${build.version}`);

// —— 加载 content ——
const LoadUtil = createLoadUtil(contentDir);
const content = await load(LoadUtil);

// —— 生成到 data_generated（纯暂存区：每次构建清空重建） ——
await rm(generatedDir, { recursive: true, force: true });
await mkdir(generatedDir, { recursive: true });
const GenerateUtil = createGenerateUtil(generatedDir);
await generate(content, GenerateUtil);

// —— 导出：dist 同名文件夹删除重建，data 为基底、data_generated 叠加 ——
// 信息源（data）构建期只读；覆盖式合并只发生在产物内。
const packDir = join(distDir, outputName);
await rm(packDir, { recursive: true, force: true });
await mkdir(packDir, { recursive: true });
await copyFile(join(root, 'pack.mcmeta'), join(packDir, 'pack.mcmeta'));
const fromData = await copyDir(dataDir, join(packDir, 'data'));
const fromGenerated = await copyDir(generatedDir, join(packDir, 'data'));
console.log(`已合并 ${fromData} 个源文件 + ${fromGenerated} 个生成文件 → dist/${outputName}`);

if (build.outputFormat.includes('zip')) {
  const zipPath = join(distDir, `${outputName}.zip`);
  await rm(zipPath, { force: true });
  await zipDir(packDir, zipPath);
  console.log(`已导出 ${zipPath}`);
}
if (build.outputFormat.includes('folder')) {
  console.log(`已导出 ${packDir}`);
} else {
  await rm(packDir, { recursive: true, force: true });
}

/**
 * 替换 ${key} 占位符。
 * @param {string} template
 * @param {Record<string, unknown>} values
 * @returns {string}
 */
function renderTemplate(template, values) {
  return template.replace(/\$\{(\w+)\}/g, (_, key) => {
    const value = values[key];
    if (value === undefined) throw new Error(`build.yml: outputName 引用了未知字段 "${key}"`);
    return String(value);
  });
}

/**
 * 把 src 目录的内容复制到 dest：覆盖同名文件、保留 dest 中多余的文件。
 * @param {string} srcDir
 * @param {string} destDir
 * @returns {Promise<number>} 复制的文件数
 */
async function copyDir(srcDir, destDir) {
  let copied = 0;
  await mkdir(destDir, { recursive: true });
  for (const entry of await readdir(srcDir, { withFileTypes: true })) {
    const src = join(srcDir, entry.name);
    const dest = join(destDir, entry.name);
    if (entry.isDirectory()) {
      copied += await copyDir(src, dest);
    } else {
      await copyFile(src, dest);
      copied += 1;
    }
  }
  return copied;
}

/**
 * 用 archiver 把目录打包为 zip。
 * @param {string} srcDir
 * @param {string} zipPath
 * @returns {Promise<void>}
 */
function zipDir(srcDir, zipPath) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(zipPath);
    const archive = new ZipArchive({ zlib: { level: 9 } });
    output.on('close', resolve);
    archive.on('error', reject);
    archive.pipe(output);
    archive.directory(srcDir, false);
    archive.finalize();
  });
}
