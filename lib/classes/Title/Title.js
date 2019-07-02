const { colorize, padString } = require('../../utils');
function Title(title, {
    char = '-',
    type = 0,
    color = false,
    borderColor = false,
    align = 'left'
} = {
    char: '-',
    type: 0,
    color: false,
    borderColor: false,
    align: 'left'
}) {
    var separator = '';
    var middle = '';
    if (Array.isArray(title)) {
        if (type === 2) type = 0;
        var maxLength = 0;
        var lines = [];
        for (const line of title) {
            maxLength = Math.max(maxLength, line.length);
        }
        separator = colorize(padString('', maxLength + 8, char), borderColor);
        for (const line of title) {
            var newLine = line;
            if (align === 'center') {
                newLine = padString(padString(newLine, Math.ceil((maxLength - line.length) / 2), ' ', true), Math.floor((maxLength - line.length) / 2));
            } else if (align === 'right') {
                newLine = padString(newLine, maxLength - line.length, true);
            } else {
                newLine = padString(newLine, maxLength - line.length);
            }
            lines.push(`${colorize(char + char + char, borderColor)} ${colorize(newLine, color)} ${colorize(char + char + char, borderColor)}`);
        }
        if (type === 1) {
            middle = lines.join(colorize('||\n||', borderColor));
        } else {
            middle = lines.join('\n');
        }
    } else {
        const noColor = `${char + char + char} ${title} ${char + char + char}`;
        middle = `${colorize(char + char + char, borderColor)} ${colorize(title, color)} ${colorize(char + char + char, borderColor)}`;
        separator = colorize(padString('', noColor.length, char), borderColor);
    }
    if (type === 1) {
        const addition = colorize('||', borderColor);
        return `\n${addition}${separator}${addition}\n${addition}${middle}${addition}\n${addition}${separator}${addition}\n`;
    } else if (type === 2) {
        const addition = colorize('//', borderColor);
        return `\n  ${addition}${separator}${addition}\n ${addition}${middle}${addition} \n${addition}${separator}${addition}  \n`;
    } else {
        return `\n${separator}\n${middle}\n${separator}\n`;
    }
}

module.exports = Title;

// v0
//--------------
//--- TITLE! ---
//--------------

// v1
//||--------------||
//||--- TITLE! ---||
//||--------------||

// v2
//  //--------------//
// //--- TITLE! ---//
////--------------//

