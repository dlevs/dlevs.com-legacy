'use strict';

const { promisify } = require('util');
const ffmpeg = require('fluent-ffmpeg');
const mapValues = require('lodash/mapValues');
const {
	createOutputPath,
	createWebPath,
	getPaddingBottom,
} = require('./buildUtils');

const runFfmpeg = ffmpegInstance =>
	new Promise((resolve, reject) => ffmpegInstance
		.on('end', resolve)
		.on('error', reject)
		.run());

const convertVideo = async (filepath) => {
	const mp4OutputPath = createOutputPath(filepath);
	const webmOutputPath = createOutputPath(filepath).replace(/\.mp4/, '.webm');
	const ffmpegInstance = ffmpeg(filepath)

		// Shared attributes
		.size('?x720') // 720p
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

	await runFfmpeg(ffmpegInstance);

	return {
		mp4: { src: createWebPath(mp4OutputPath) },
		webm: { src: createWebPath(webmOutputPath) },
	};
};

const getSharedVideoMeta = async (filepath) => {
	const meta = await promisify(ffmpeg.ffprobe)(filepath);
	const videoMeta = meta.streams.find(streamMeta => streamMeta.codec_type === 'video');
	const { width, height } = videoMeta;

	return {
		width,
		height,
		paddingBottom: getPaddingBottom(width, height),
	};
};

const processVideo = async (filepath) => {
	const convertedVideoMeta = await convertVideo(filepath);
	const sharedVideoMeta = await getSharedVideoMeta(createOutputPath(filepath));
	const versions = mapValues(convertedVideoMeta, meta => ({
		...sharedVideoMeta,
		...meta,
	}));

	return {
		type: 'video',
		versions,
	};
};

module.exports = processVideo;
