import { Station } from '../model/Station.js';
import { optionalString, requireString } from '../util/validate.js';

/**
 * 载入 content/station/ 下的共享站文件，填入 content.stations。
 * @param {import('../load.js').Content} content
 * @param {import('../util/io.js').LoadUtil} LoadUtil
 */
export async function loadStations(content, LoadUtil) {
  for (const file of await LoadUtil.listFiles('station')) {
    const source = `station/${file}`;
    const def = await LoadUtil.readYaml(source);
    const id = file.slice(0, -'.yml'.length);
    const name = requireString(def.name, source, 'name');
    content.stations.set(id, new Station({
      id,
      name,
      nameEn: optionalString(def.name_en, source, 'name_en', name),
    }));
  }
}
