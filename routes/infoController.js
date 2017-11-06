const { getLastCommit } = require('../lib/gitUtils');
const { version } = require('../package');

module.exports = () => {
	// Get last commit data only once, on server init, so we can be sure that
	// the version of the server which is running is the one that is reported.
	const lastCommitPromise = getLastCommit();
	const serverStartDate = new Date().toString();

	return {
		index: async (ctx) => {
			ctx.body = JSON.stringify({
				version,
				date: new Date().toString(),
				serverStartDate,
				environment: process.env.NODE_ENV,
				lastCommit: await lastCommitPromise,
			}, null, '\t');
			ctx.type = 'json';
		},
	};
};
