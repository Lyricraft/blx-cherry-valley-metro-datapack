/**
 *
 * @param {import('../../model/Station.js').Station} station
 * @param {import('../../model/Line.js').Line} line
 */
export function getTransferInfo(station, line) {
    if (station.lines.length <= 1) {
        return [[], []];
    }

    /**
     *
     * @type {import('../../model/Line.js').Line[]}
     */
    const transfers = [];

    for (const transferPossible of station.lines) {
        if (transferPossible !== line && transferPossible.stopAt(station).open) {
            transfers.push(transferPossible);
        }
    }

    if (transfers.length === 0) {
        return [[], []];
    }

    const transferInfo = [];
    const transferInfoEn = [];

    transferInfo.push('可换乘');
    transferInfoEn.push('You can transfer ');

    for (let i = 0; i < transfers.length; i++) {
        const transfer = transfers[i];

        transferInfo.push({text: transfer.name, color: transfer.color});
        if (i !== transfers.length - 1) {
            transferInfo.push('、');
        }

        transferInfoEn.push({text: transfer.nameEn, color: transfer.color});
        if (i !== transfers.length - 1) {
            transferInfoEn.push(', ');
        }
    }

    transferInfo.push('。');
    transferInfoEn.push('. ');


    return [transferInfo, transferInfoEn];
}