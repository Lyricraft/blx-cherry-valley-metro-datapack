import {getTransferInfo} from './util/getTransferInfo.js';
import {getTransferDisplay} from "./util/getTransferDisplay.js";

/**
 * @param {import('../model/Line.js').Stop} stop
 * @param {import('../model/Line.js').Line} line
 * @param {import('../model/Line.js').Direction} direction
 */
export function genSignalArriveOneStopDirection(stop, line, direction) {
    if (!stop.open) {
        if (line.nextOpen(stop, direction)) {
            // 跨站
            return 'return 0';
        }
    }

    const isLast = !line.nextOpen(stop, direction);

    const [transferInfo, transferInfoEn] = getTransferInfo(stop.station, line);

    const reportRaw = {
        color: 'gray',
        text: '',
        extra: ['',
            '前方到站',
            isLast ? '为本次列车终点站' : '',
            {text: stop.station.name, color: line.color},
            '，车门开启方向为',
            {text: (stop.doorSide[direction] === 'left') ? '左侧' : '右侧', color: line.color},
            '。',
            ...transferInfo,
            '\n',

            'We are arriving at ',
            {text: stop.station.nameEn, color: line.color},
            isLast ? ', the last station of this train' : '',
            '. The doors will open on the ',
            {text: stop.doorSide[direction], color: line.color},
            ' side. ',
            ...transferInfoEn,
        ],
    };

    const subtitleRaw = {
        color: 'white',
        text: '',
        extra: ['',
            {text: `[${line.name}] ===> ${stop.station.name}`,color: line.color},
            ...getTransferDisplay(stop.station, line),
            isLast ? '' : ` => ... => ${line.lastOpen(direction).station.name}`,
        ]
    };

    return `tellraw @s ${JSON.stringify(reportRaw)}
title @s title {text:''}
title @s subtitle ${JSON.stringify(subtitleRaw)}`;
}
