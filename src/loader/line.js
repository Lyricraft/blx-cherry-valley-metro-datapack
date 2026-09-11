import { Line, Stop } from '../model/Line.js';
import { Station } from '../model/Station.js';
import { optionalString, requireString, toDoorSidePair } from '../util/validate.js';

/**
 * 载入 content/line/ 下的线路文件，填入 content.lines。
 * 依赖已载入的 metro.yml（默认门侧）与共享站文件（解析 reference）。
 * @param {import('../load.js').Content} content
 * @param {import('../util/io.js').LoadUtil} LoadUtil
 */
export async function loadLines(content, LoadUtil) {
  const { defaultDoorSide } = /** @type {import('../model/Metro.js').MetroConfig} */ (content.config);
  for (const file of await LoadUtil.listFiles('line')) {
    const source = `line/${file}`;
    const def = await LoadUtil.readYaml(source);
    const name = requireString(def.name, source, 'name');
    const color = requireString(def.color, source, 'color');
    if (!/^#[0-9a-f]{6}$/i.test(color)) {
      throw new Error(`${source}: 颜色应形如 "#b22222"，收到 ${JSON.stringify(color)}`);
    }
    if (!Array.isArray(def.stations) || def.stations.length === 0) {
      throw new Error(`${source}: "stations" 应为非空列表`);
    }
    const stops = def.stations.map(
      (entry, index) => readStop(entry, index, source, defaultDoorSide, content),
    );
    content.lines.push(new Line({
      id: file.slice(0, -'.yml'.length),
      name,
      nameEn: optionalString(def.name_en, source, 'name_en', name),
      color,
    }, stops));
  }
}

/**
 * 解析线路中的一个站点条目。
 * @param {unknown} entry
 * @param {number} index
 * @param {string} source
 * @param {import('../model/Line.js').DoorSidePair} defaultDoorSide
 * @param {import('../load.js').Content} content
 * @returns {Stop}
 */
function readStop(entry, index, source, defaultDoorSide, content) {
  const where = `${source}: stations[${index}]`;
  if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
    throw new Error(`${where}: 应为站点映射`);
  }
  const def = /** @type {Record<string, any>} */ (entry);
  const station = resolveStation(def, where, content);
  let open = true;
  if (def.open !== undefined) {
    if (typeof def.open !== 'boolean') throw new Error(`${where}: "open" 应为布尔值`);
    open = def.open;
  }
  return new Stop(station, {
    doorSide: toDoorSidePair(def.door_side, where, defaultDoorSide),
    open,
  });
}

/**
 * 站点条目的两种写法：reference 引用共享站文件，或内联 id/name 定义新站。
 * @param {Record<string, any>} def
 * @param {string} source
 * @param {import('../load.js').Content} content
 * @returns {Station}
 */
function resolveStation(def, source, content) {
  if (def.reference !== undefined) {
    if (def.id !== undefined) throw new Error(`${source}: "reference" 与 "id" 只能二选一`);
    const station = content.stations.get(def.reference);
    if (!station) throw new Error(`${source}: 找不到引用的车站 "${def.reference}"`);
    return station;
  }
  const id = requireString(def.id, source, 'id');
  const name = requireString(def.name, source, 'name');
  const nameEn = optionalString(def.name_en, source, 'name_en', name);
  const existing = content.stations.get(id);
  if (existing) {
    if (existing.name !== name || existing.nameEn !== nameEn) {
      throw new Error(`${source}: 车站 id "${id}" 已被定义为 "${existing.name}"`);
    }
    return existing;
  }
  const station = new Station({ id, name, nameEn });
  content.stations.set(id, station);
  return station;
}
