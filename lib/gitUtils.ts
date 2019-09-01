// const fs = require('fs-extra');
// const path = require('path');
// const { exec } = require('child-process-promise');

/**
 * Get data about the last commit in this repository.
 *
 * In the case of the production/ staging sites, the project directory is not a
 * git repository. For these cases, this function relies on the post-receive
 * hook to generate a .gitdatafrompostreceivehook in the project root.
 *
 * TODO: Get rid of all JSDoc type annotations once TypeScript migration is complete
 */
export const getLastCommit = async () =>
	({
		// TODO: Fix this:
		ref: 'TODO',
		sha: 'TODO',
		message: 'TODO',
		date: 'TODO',
	});
