'use strict';

const { promisify } = require('util');
const ffmpeg = require('fluent-ffmpeg');
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

const SIZE_720P = '?x720';

const runFfmpeg = instance =>
	new Promise((resolve, reject) => instance
		.on('end', resolve)
		.on('error', reject)
		.run());

const convertVideo = (filepath) => {
	const mp4OutputPath = createOutputPath(filepath);
	// TODO: Use ext change function
	const webmOutputPath = createOutputPath(filepath).replace('.mp4', '.webm');
	const file = ffmpeg(filepath)

		// Shared attributes
		.size(SIZE_720P)
		.videoBitrate('1000k')
		.audioBitrate('96k')
		.audioCodec('aac')
		.audioFrequency(22050)
		.audioChannels(2)

		// Create mp4
		.output(mp4OutputPath)
		.format('mp4')
		.videoCodec('libx264')

		// Create webm
		.output(webmOutputPath)
		.format('webm')
		.withVideoCodec('libvpx')
		.addOptions(['-qmin 0', '-qmax 50', '-crf 5'])
		.withVideoBitrate(1024)
		.withAudioCodec('libvorbis');

	await runFfmpeg(file);

	return [
		{ src: mp4OutputPath },
		{ src: webmOutputPath },
	];
};

const getSharedVideoMeta = async (filepath) => {
	const meta = await promisify(ffmpeg.ffprobe)(filepath);
	const videoMeta = meta.streams.find(streamMeta => streamMeta.codec_type === 'video');
	const { width, height } = videoMeta;
	return {
		width,
		height,
		type: 'video',
		paddingBottom: getPaddingBottom(width, height),
	};
}

// TODO: There is a lot of duplication between this file and processImages.js. Reduce duplication.
(async () => {


	processVideos(path.join(MEDIA_TO_PROCESS_ROOT, '**/*.mp4'));
})();

const processVideos = async (pattern) => {


	await eachLimit(filepaths, 8, async (filepath) => {
		const convertedVideoMeta = await convertVideo(filepath);
		const sharedVideoMeta = await getSharedVideoMeta(filepath);

		return convertedVideoMeta.map(meta => ({
			...sharedVideoMeta,
			...meta
		}))
	});
};
