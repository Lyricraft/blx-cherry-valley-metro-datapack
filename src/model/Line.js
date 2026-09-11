/**
 * 行车方向：stops 列表由上行端排到下行端，靠前的站位于靠后站的上行侧。
 * up = 逆 stops 列表顺序行驶（上行），down = 按 stops 列表顺序行驶（下行）。
 * 对应 mcfunction 宏 $(direction)：up = 0，down = 1。
 * @typedef {'up' | 'down'} Direction
 */

/**
 * 车门方向：以列车行进方向为参照，left = 左侧开门，right = 右侧开门。
 * @typedef {'left' | 'right'} DoorSide
 */

/**
 * 上、下行各自的车门方向。
 * @typedef {{ up: DoorSide, down: DoorSide }} DoorSidePair
 */

/** mcfunction 宏 $(direction) 的取值。 @type {Record<Direction, 0 | 1>} */
export const DIRECTION_IDS = { up: 0, down: 1 };

/** 线路上的一座停靠站：车站本体 + 本线在此站的配置。 */
export class Stop {
  /**
   * @param {import('./Station.js').Station} station
   * @param {object} options
   * @param {DoorSidePair} options.doorSide 已套用默认值解析完毕
   * @param {boolean} options.open 是否开通运营
   */
  constructor(station, { doorSide, open }) {
    this.station = station;
    this.doorSide = doorSide;
    this.open = open;
  }
}

/** 一条线路；stops 从上行端排到下行端，下标即站序。 */
export class Line {
  /**
   * @param {object} def
   * @param {string} def.id
   * @param {string} def.name
   * @param {string} def.nameEn
   * @param {string} def.color 十六进制颜色，如 #b22222
   * @param {Stop[]} stops
   */
  constructor({ id, name, nameEn, color }, stops) {
    this.id = id;
    this.name = name;
    this.nameEn = nameEn;
    this.color = color;
    this.stops = stops;
  }

  /**
   * 该车站在本线上的停靠信息；不在本线上时返回 undefined。
   * @param {import('./Station.js').Station} station
   * @returns {Stop | undefined}
   */
  stopAt(station) {
    return this.stops.find((stop) => stop.station === station);
  }

  /**
   * 按行车方向输出停靠站序列（返回副本）。
   * @param {Direction} direction
   * @returns {Stop[]}
   */
  stopsIn(direction) {
    const ordered = [...this.stops];
    return direction === 'up' ? ordered.reverse() : ordered;
  }

  /**
   * 沿行车方向，从 stop 出发的下一站；它是该方向终点站时返回 undefined。
   * @param {Stop} stop
   * @param {Direction} direction
   * @returns {Stop | undefined}
   */
  next(stop, direction) {
    return this.stops[this.stops.indexOf(stop) + (direction === 'up' ? -1 : 1)];
  }

  /**
   * 沿行车方向，stop 的上一站；它是该方向起点站时返回 undefined。
   * @param {Stop} stop
   * @param {Direction} direction
   * @returns {Stop | undefined}
   */
  previous(stop, direction) {
    return this.next(stop, direction === 'up' ? 'down' : 'up');
  }

  /**
   * 沿行车方向，从 stop 出发的下一个开通站（跳过未开通站）；没有则返回 undefined。
   * @param {Stop} stop
   * @param {Direction} direction
   * @returns {Stop | undefined}
   */
  nextOpen(stop, direction) {
    let current = this.next(stop, direction);
    while (current && !current.open) current = this.next(current, direction);
    return current;
  }

  /**
   * 沿行车方向，stop 的上一站中最近的开通站；没有则返回 undefined。
   * @param {Stop} stop
   * @param {Direction} direction
   * @returns {Stop | undefined}
   */
  previousOpen(stop, direction) {
    return this.nextOpen(stop, direction === 'up' ? 'down' : 'up');
  }

  /**
   * 沿行车方向，本线的终点站。
   * @param {Direction} direction
   * @returns {Stop}
   */
  last(direction) {
    const ordered = this.stopsIn(direction);
    return ordered[ordered.length - 1];
  }

  /**
   * 沿行车方向，本线的最后一个开通站（跳过未开通站）；没有则返回 undefined。
   * @param {Direction} direction
   * @returns {Stop | undefined}
   */
  lastOpen(direction) {
    let current = this.last(direction);
    while (current && !current.open) current = this.previous(current, direction);
    return current;
  }
}
