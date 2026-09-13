import {getTransferDisplay} from "./util/getTransferDisplay.js";

/**
 * @param {import('../model/Line.js').Stop} stop
 * @param {import('../model/Line.js').Line} line
 * @param direction
 * @param {import('../model/Metro.js').MetroConfig} config
 */
export function genSignalDepartOneStopDirection(stop, line, direction, config) {
    if (!stop.open) {
        // 不开放的车站无行为
        return 'return 0';
    }

    const nextStop = line.nextOpen(stop, direction);
    if (!nextStop) {
        // 扣停
        return `execute on vehicle run tag @s add cvm_force_stop
title @s title {text:"扣停车辆", color:"red"}
title @s subtitle {text:"线路异常，请下车并返回车站", color:"yellow"}`;
    }

    const nextIsLast = !line.nextOpen(nextStop, direction);

    const lastStop = line.lastOpen(direction);

    const reportRaw = {
        color: 'gray',
        text: '',
        extra: ['',
            `欢迎乘坐${config.name}`,
            {text: line.name, color: line.color},
            '，',
            ...(nextIsLast ? [
                '下一站为本次列车终点站',
                {text: nextStop.station.name, color: line.color},
                '。',
            ] : [
                '本次列车开往',
                {text: lastStop.station.name, color: line.color},
                '，下一站',
                {text: nextStop.station.name, color: line.color},
                '。'
            ]),
            '请站稳扶好。',
            '\n',

            `Welcome aboard ${config.nameEn} `,
            {text: line.nameEn, color: line.color},
            ', ',
            ...(nextIsLast ? [
                'The next station is ',
                {text: nextStop.station.nameEn, color: line.color},
                ', the last station of this train. '
            ] : [
                'This train is bound for ',
                {text: lastStop.station.nameEn, color: line.color},
                ', the next station is ',
                {text: nextStop.station.nameEn, color: line.color},
                '. '
            ]),
            'Please hold the handrail.',
        ],
    };

    const subtitleRaw = {
        color: 'white',
        text: '',
        extra: ['',
            {text: `[${line.name}] ===> `,color: line.color},
            nextStop.station.name,
            ...getTransferDisplay(nextStop.station, line),
            nextIsLast ? '' : ` => ... => ${line.lastOpen(direction).station.name}`,
        ]
    };

    return `tellraw @s ${JSON.stringify(reportRaw)}
title @s title {text:''}
title @s subtitle ${JSON.stringify(subtitleRaw)}`;
}