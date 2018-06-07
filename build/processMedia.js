'use strict';

const { addMedia } = require('./buildUtils');
const { root } = require('../lib/pathUtils');
const processVideos = require('./processVideos');
const processImages = require('./processImages');
const processSvgs = require('./processSvgs');

const createMediaGlob = pattern =>
	root('./publicSrc/+(process|processUncommitted)/media', pattern);

const processMedia = async () => {
	await addMedia('SVG', processSvgs, createMediaGlob('**/*.svg'));
	// TODO: Change this glob to be all images
	await addMedia('image', processImages, createMediaGlob('travel/england/*/*.+(png|jpg)'));
	await addMedia('video', processVideos, createMediaGlob('**/*.mp4'));
};

processMedia();
