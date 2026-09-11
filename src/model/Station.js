/** 一座车站；被多条线路停靠时共享同一实例。 */
export class Station {
  /**
   * @param {object} def
   * @param {string} def.id 标识：站文件名，或线路内联声明的 id
   * @param {string} def.name
   * @param {string} def.nameEn
   */
  constructor({ id, name, nameEn }) {
    this.id = id;
    this.name = name;
    this.nameEn = nameEn;
    /** 停靠本站的线路（由加载器填好，勿手工维护）。 @type {import('./Line.js').Line[]} */
    this.lines = [];
  }
}
