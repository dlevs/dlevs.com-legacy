const {exec} = require('child-process-promise');

exports.getLastCommit = async () => {
	const gitStatsCmd = await exec('git log -1 --format="%D_-_%H_-_%s_-_%cd"');
	const [ref, sha, message, date] = gitStatsCmd.stdout.trim().split('_-_');

	return {ref, sha, message, date};
};
