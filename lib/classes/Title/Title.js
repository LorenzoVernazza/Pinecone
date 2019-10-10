const { colorize, padString } = require('../../utils');
function Title(title, {
	char = '-',
	type = 0,
	color = false,
	frameColor = false,
	align = 'left',
	sideChar,
	side = 2
} = {
	char: '-',
	type: 0,
	color: false,
	frameColor: false,
	align: 'left',
	sideChar,
	side: 2
}) {
	if (!sideChar) {
		if (type === 1) sideChar = '|';
		if (type === 2) sideChar = '/';
	}
	var separator = '';
	var middle = '';
	var length = 1;
	if (Array.isArray(title)) {
		length = title.length;
		var maxLength = 0;
		var lines = [];
		for (const line of title) {
			maxLength = Math.max(maxLength, line.length);
		}
		separator = padString('', maxLength + 2 + (side * 2), char);
		for (const line of title) {
			var newLine = line;
			if (align === 'center') {
				newLine = padString(padString(newLine, Math.floor((maxLength - line.length) / 2), ' ', true), Math.ceil((maxLength - line.length) / 2));
			} else if (align === 'right') {
				newLine = padString(newLine, maxLength - line.length, ' ', true);
			} else {
				newLine = padString(newLine, maxLength - line.length);
			}
			if (type === 2) {
				const index = lines.length;
				const left = colorize(((index > 0) ? padString(sideChar, length - index, ' ', true) : '') + padString('', side + index, char), frameColor);
				const right = colorize(padString('', length + side - index - 1, char) + ((index < length - 1) ? padString(sideChar, index) : ''), frameColor);
				lines.push(`${left} ${colorize(newLine, color)} ${right}`);
			} else {
				lines.push(`${colorize(padString('', side, char), frameColor)} ${colorize(newLine, color)} ${colorize(padString('', side, char), frameColor)}`);
			}
		}
		if (type === 2) separator = padString(separator, length - 1, char);
		if (type === 1) {
			middle = lines.join(colorize(sideChar + '\n' + sideChar, frameColor));
		} else {
			middle = lines.join('\n');
		}
	} else {
		const noColor = `${padString('', side, char)} ${title} ${padString('', side, char)}`;
		middle = `${colorize(padString('', side, char), frameColor)} ${colorize(title, color)} ${colorize(padString('', side, char), frameColor)}`;
		separator = padString('', noColor.length, char);
	}
	separator = colorize(separator, frameColor);
	if (type === 1) {
		const addition = colorize(sideChar, frameColor);
		return `\n${addition}${separator}${addition}\n${addition}${middle}${addition}\n${addition}${separator}${addition}\n`;
	} else if (type === 2) {
		const addition = colorize(sideChar, frameColor);
		return `\n${padString('', 1 + length)}${addition}${separator}${addition}\n${padString('', length)}${addition}${middle}${addition}${padString('', length)}\n${addition}${separator}${addition}${padString('', 1 + length)}\n`;
	} else {
		return `\n${separator}\n${middle}\n${separator}\n`;
	}
}

module.exports = Title;

// v0
// --------------
// --- TITLE! ---
// --------------

// v1
// ||--------------||
// ||--- TITLE! ---||
// ||--------------||

// v2
//  //--------------//
// //--- TITLE! ---//
// //--------------//

//   //---------------//
//  //--- TITLE! ----//
// //---- TITLE! ---//
// //---------------//