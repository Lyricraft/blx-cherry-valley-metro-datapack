/**
 * 内容字段校验小工具；报错信息带 source（文件与位置），便于内容作者定位。
 * @module
 */

/**
 * @param {unknown} value
 * @param {string} source
 * @param {string} key
 * @returns {string}
 */
export function requireString(value, source, key) {
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${source}: 缺少必填字段 "${key}"`);
  }
  return value;
}

/**
 * @param {unknown} value
 * @param {string} source
 * @param {string} key
 * @param {string} fallback
 * @returns {string}
 */
export function optionalString(value, source, key, fallback) {
  if (value === undefined) return fallback;
  return requireString(value, source, key);
}

/**
 * 校验内容文件中的门侧取值。
 * @param {unknown} value
 * @param {string} source
 * @returns {import('../model/Line.js').DoorSide}
 */
export function toDoorSide(value, source) {
  if (value !== 'left' && value !== 'right') {
    throw new Error(`${source}: 门侧只能是 "left" 或 "right"，收到 ${JSON.stringify(value)}`);
  }
  return value;
}

/**
 * 把 'left'/'right' 或 { up, down }（可只写一侧）归一化为完整的 DoorSidePair。
 * @param {unknown} value
 * @param {string} source
 * @param {import('../model/Line.js').DoorSidePair} fallback
 * @returns {import('../model/Line.js').DoorSidePair}
 */
export function toDoorSidePair(value, source, fallback) {
  if (value === undefined || value === null) return { ...fallback };
  if (typeof value === 'string') {
    const side = toDoorSide(value, source);
    return { up: side, down: side };
  }
  if (typeof value !== 'object') {
    throw new Error(`${source}: 无效的门侧配置 ${JSON.stringify(value)}`);
  }
  const def = /** @type {Record<string, unknown>} */ (value);
  return {
    up: def.up === undefined ? fallback.up : toDoorSide(def.up, `${source} (up)`),
    down: def.down === undefined ? fallback.down : toDoorSide(def.down, `${source} (down)`),
  };
}
