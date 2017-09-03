const {promisify} = require('util');
const glob = promisify(require('glob'));
const fs = require('fs-extra');
const eachLimit = promisify(require('async').eachLimit);

/**
 * Copy static files.
 *
 * These are stored in a "resources" folder, and organised via arbitrary
 * directory names. All immediate child directories of "resources" are flattened.
 *
 * This is useful for including static assets referenced in 3rd party CSS.
 *
 * For example, we may have the files:
 *
 * /styles/resources/photoswipe/default-icons.png
 * /styles/resources/photoswipe/loading-spinner.gif
 * /styles/resources/another-plugin/sprites.png
 *
 * These will be copied to:
 * /public-dist/default-icons.png
 * /public-dist/loading-spinner.gif
 * /public-dist/sprites.png
 *
 * It's not ideal, but it does the job for now, without forcing us to edit
 * 3rd party CSS includes.
 *
 * @returns {Promise}
 */
const copyResources = async () => {
	const filepaths = await glob('styles/resources/**/*.*');

	const matchPartToRemove = /styles\/(resources\/.+?\/)/;

	await eachLimit(filepaths, 4, async (filepath) => {
		const partToRemove = matchPartToRemove.exec(filepath)[1];
		const outputFilepath = 'public-dist/' + filepath.replace(partToRemove, '');

		console.log(`Copying: ${filepath} > ${outputFilepath}`);

		await fs.copy(filepath, outputFilepath);
	});

};

copyResources();
