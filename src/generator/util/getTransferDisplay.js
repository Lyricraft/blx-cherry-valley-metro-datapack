/**
 *
 * @param {import('../../model/Station.js').Station} station
 * @param {import('../../model/Line.js').Line} line
 */
export function getTransferDisplay(station, line) {
    const transferDisplay = [];

    if (station.lines.length > 1) {
        for (const transferPossible of station.lines) {
            if (transferPossible !== line && transferPossible.stopAt(station).open) {
                transferDisplay.push({text: `[${transferPossible.name}]`, color: transferPossible.color});
            }
        }
    }

    return transferDisplay;
}