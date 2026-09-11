import { optionalString, requireString, toDoorSidePair } from '../util/validate.js';

/**
 * 载入 content/metro.yml，填入 content.config。
 * @param {import('../load.js').Content} content
 * @param {import('../util/io.js').LoadUtil} LoadUtil
 */
export async function loadMetro(content, LoadUtil) {
  const source = 'metro.yml';
  const def = await LoadUtil.readYaml(source);
  const name = requireString(def.name, source, 'name');
  content.config = {
    name,
    nameEn: optionalString(def.name_en, source, 'name_en', name),
    defaultDoorSide: toDoorSidePair(def.door_side, source, { up: 'left', down: 'left' }),
  };
}
