import {genSignalArriveOneStopDirection} from "./generator/genSignalArrive.js";
import {genSignalDepartOneStopDirection} from "./generator/genSignalDepart.js";
import path from "node:path";
import Consts from "./Consts.js";

/**
 * @param {import('load.js').Content} content
 * @param {import('util/io.js').GenerateUtil} GenerateUtil
 */
export async function generate(content, GenerateUtil) {
    // gen signal control
    for (const line of content.lines) {
        for (const stop of line.stops) {
            for (const direction of ['up', 'down']) {
                // gen depart
                const departRaw = genSignalDepartOneStopDirection(stop, line, direction, content.config);
                if (departRaw) {
                    await GenerateUtil.saveRaw(path.join(Consts.METRO_NAMESPACE,
                        `function/signal_control/generated/depart_${stop.station.id}_${line.id}_${direction}.mcfunction`), departRaw);
                }
                // gen arrive
                const arriveRaw = genSignalArriveOneStopDirection(stop, line, direction);
                if (arriveRaw) {
                    await GenerateUtil.saveRaw(path.join(Consts.METRO_NAMESPACE,
                        `function/signal_control/generated/arrive_${stop.station.id}_${line.id}_${direction}.mcfunction`), arriveRaw);
                }
            }
        }
    }
}