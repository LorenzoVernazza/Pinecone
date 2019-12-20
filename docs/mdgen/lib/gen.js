const fs = require('fs');
const path = require('path');
const { name } = require('../config/vars.json');

function fillTemplate({
	version,
	date
}, changelog, old, next) {
	var template = '';
	template += `# <b>${name} v${version} (Current), ${date}</b>\n${removeComments(changelog)}\n`;
	if (next) {
		template += `---\n## <b>What's next?</b>\n${removeComments(next)}\n`;
	}
	if (old) {
		template += `---\n## <b>Previous versions:</b>\n${removeComments(old)}\n`;
	}
	return template;
}

function removeComments(text) {
	return text.replace(/<!--.*?-->\s*/sg, '');
}

function updateChangelogs() {
	const changelogs = fs.readFileSync(path.resolve(__dirname, '../CHANGELOGS.md')).toString();
	const release = (fs.readFileSync(path.resolve(__dirname, '../RELEASE.md')).toString()).replace(/^### &nbsp;&nbsp;/gm, '#### &nbsp;&nbsp;');
	const template = release + (release && '\n---\n') + changelogs;
	fs.writeFileSync(path.resolve(__dirname, '../CHANGELOGS.md'), template);
	return template;
}

function updateRelease({ version, date }) {
	const changelog = fs.readFileSync(path.resolve(__dirname, '../CHANGELOG.md')).toString();
	var returnFile = removeComments(changelog);
	var template =
	`### Version ${version}, ${date}
	\n${returnFile}`;

	fs.writeFileSync(path.resolve(__dirname, '../RELEASE.md'), template);
	fs.copyFileSync(path.resolve(__dirname, '../templates/CHANGELOG.md'), path.resolve(__dirname, '../CHANGELOG.md'));
	return returnFile;
}

function createChangelog(version) {
	const dateObj = new Date();
	const date = dateObj.getDate() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getFullYear();
	const old = updateChangelogs();
	const changelog = updateRelease({ version, date });
	const newFile = fillTemplate({ version, date },
		changelog,
		old,
		fs.readFileSync(path.resolve(__dirname, '../NEXT.md')).toString()
	);
	fs.writeFileSync('CHANGELOG.md', newFile);
}

function updatePackage(version) {
	const packageJson = require(path.join(process.cwd(), 'package.json'));
	packageJson.version = version;
	fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
}

function main() {
	const version = process.argv[3];
	if (version) {
		console.log('Creating docs for v' + version);
		createChangelog(version);
		updatePackage(version);
	} else {
		console.log('Missing version');
	}
}

module.exports = main;
