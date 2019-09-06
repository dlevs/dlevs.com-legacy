'use strict';

const { addMedia } = require('./buildUtils');
const { root } = require('../lib/pathUtils');
const processVideos = require('./processVideos');
const processImages = require('./processImages');
const processSvgs = require('./processSvgs');

const createMediaGlob = pattern =>
	root('./publicSrc/process/media', pattern);

const processMedia = async () => {
	await addMedia('SVG', processSvgs, createMediaGlob('**/*.svg'));
	await addMedia('image', processImages, createMediaGlob('**/*.+(png|jpg)'));
	await addMedia('video', processVideos, createMediaGlob('**/*.mp4'));
};

processMedia();
