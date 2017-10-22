const {getLastCommit} = require('../lib/gitUtils');
const {version} = require('../package');

module.exports = () => ({
	index: async (ctx) => {
		ctx.body = JSON.stringify({
			version,
			date: new Date().toString(),
			environment: process.env.NODE_ENV,
			lastCommit: await getLastCommit()
		}, null, '\t');
		ctx.type = 'json';
	}
});
