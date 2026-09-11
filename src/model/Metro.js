/**
 * 全局配置（content/metro.yml）。
 * @typedef {object} MetroConfig
 * @property {string} name
 * @property {string} nameEn
 * @property {import('./Line.js').DoorSidePair} defaultDoorSide 站点未单独配置门侧时的默认值
 */

/** 整个地铁网络：所有线路与车站的聚合。 */
export class Metro {
  /**
   * @param {MetroConfig} config
   * @param {import('./Line.js').Line[]} lines 按线路编号排序
   * @param {import('./Station.js').Station[]} stations 全部车站，含仅内联定义的站
   */
  constructor(config, lines, stations) {
    this.config = config;
    this.lines = lines;
    this.stations = stations;
  }

  /**
   * @param {string} id
   * @returns {import('./Station.js').Station | undefined}
   */
  findStation(id) {
    return this.stations.find((station) => station.id === id);
  }
}
