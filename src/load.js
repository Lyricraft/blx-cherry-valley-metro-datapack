import { Metro } from './model/Metro.js';
import { loadLines } from './loader/line.js';
import { loadMetro } from './loader/metro.js';
import { loadStations } from './loader/station.js';

/**
 * 加载产物：由 load.js 建立结构，各 loader 依次填充，最后组装出 metro。
 * @typedef {object} Content
 * @property {import('./model/Metro.js').MetroConfig | null} config
 * @property {Map<string, import('./model/Station.js').Station>} stations 加载期索引：解析 reference、内联站去重
 * @property {import('./model/Line.js').Line[]} lines
 * @property {import('./model/Metro.js').Metro | null} metro
 */

/**
 * 加载 content 目录，建立数据结构。
 * 顺序不可换：线路要取 metro.yml 的默认门侧、要解析共享站引用。
 * @param {import('./util/io.js').LoadUtil} LoadUtil
 * @returns {Promise<Content>}
 */
export async function load(LoadUtil) {
  /** @type {Content} */
  const content = {
    config: null,
    stations: new Map(),
    lines: [],
    metro: null,
  };
  await loadMetro(content, LoadUtil);
  await loadStations(content, LoadUtil);
  await loadLines(content, LoadUtil);

  const config = /** @type {import('./model/Metro.js').MetroConfig} */ (content.config);
  content.metro = new Metro(config, content.lines, [...content.stations.values()]);
  for (const line of content.lines) {
    for (const stop of line.stops) {
      if (!stop.station.lines.includes(line)) stop.station.lines.push(line);
    }
  }
  console.log(`已加载 ${content.lines.length} 条线路、${content.stations.size} 座车站`);
  return content;
}
