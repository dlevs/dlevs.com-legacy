// @flow

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child-process-promise');

/**
 * Get data about the last commit in this repository.
 *
 * In the case of the production/ staging sites, the project directory is not a
 * git repository. For these cases, this function relies on the post-receive
 * hook to generate a .gitdatafrompostreceivehook in the project root.
 *
 * @return {Promise.<{ref: String, sha: String, message: String, date: String}>}
 */
exports.getLastCommit = async () => {
	let data;

	try {
		const filepath: string = path.join(__dirname, '../.gitdatafrompostreceivehook');
		data = await fs.readFile(filepath, 'utf8');
	} catch (err) {
		const cmd = await exec('git log -1 --format="%D_-_%H_-_%s_-_%cd"');
		data = cmd.stdout;
	}

	const [ref, sha, message, date] = data.trim().split('_-_');
	return {
		ref, sha, message, date,
	};
};
