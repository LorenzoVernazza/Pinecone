const { colorize } = require('../utils');
function Title(title, {
    char = '-',
    type = 0,
    color = false
} = {
    char: '-',
    type: 0,
    color = false
}) {
    const middle = `${colorize(char + char + char, color)} ${title} ${colorize(char + char + char, color)}`;
    const separator = colorize(middle.replace(/./g, char), color);
    if (type === 1) {
        return `\n${separator}\n${middle}\n${separator}\n`;
    } else if (type === 2) {
        return `\n||${separator}||\n||${middle}||\n||${separator}||\n`;
    } else {
        return `\n  //${separator}//\n //${middle}// \n//${separator}//  \n`;
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

