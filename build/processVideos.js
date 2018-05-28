'use strict';

const { promisify } = require('util');
const ffprobe = promisify(require('fluent-ffmpeg').ffprobe);
const path = require('path');
const set = require('lodash/set');
const eachLimit = promisify(require('async').eachLimit);
const glob = promisify(require('glob'));
const fs = require('fs-extra');
const { root } = require('../lib/pathUtils');
const {
	MEDIA_TO_PROCESS_ROOT,
	createOutputPath,
	createWebPath,
	getPaddingBottom,
	mediaData,
	isFileNew,
} = require('./buildUtils');

// TODO: There is a lot of duplication between this file and processImages.js. Reduce duplication.
(async () => {
	const processVideos = async (pattern) => {
		const allFilepaths = await glob(pattern);
		// eslint-disable-next-line no-console
		console.log(`${allFilepaths.length} video files found`);
		const filepaths = allFilepaths.filter(isFileNew);
		// eslint-disable-next-line no-console
		console.log(`${filepaths.length} videos are new`);

		if (!filepaths.length) return;

		await eachLimit(filepaths, 8, async (filepath) => {
			const meta = await ffprobe(filepath);
			const videoMeta = meta.streams.find(streamMeta => streamMeta.codec_type === 'video');
			const { width, height } = videoMeta;
			set(
				mediaData,
				[createWebPath(filepath), 'default'],
				{
					width,
					height,
					type: 'video',
					format: 'mp4',
					src: createWebPath(filepath),
					paddingBottom: getPaddingBottom(width, height),
				},
			);

			await fs.copyFile(filepath, createOutputPath(filepath));
		});

		const metaOutputPath = root('./data/generated/media.json');
		// eslint-disable-next-line no-console
		console.log(`Writing video meta data to ${metaOutputPath}`);
		fs.writeFile(metaOutputPath, JSON.stringify(mediaData, null, '\t'));
	};

	processVideos(path.join(MEDIA_TO_PROCESS_ROOT, '**/*.mp4'));
})();
