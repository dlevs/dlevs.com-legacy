'use strict';

import { root } from '@root/lib/pathUtils';
import { addMedia } from './buildUtils';
import processVideos from './processVideos';
import processImages from './processImages';
import processSvgs from './processSvgs';

const createMediaGlob = pattern =>
	root('./publicSrc/process/media', pattern);

const processMedia = async () => {
	await addMedia('SVG', processSvgs, createMediaGlob('**/*.svg'));
	await addMedia('image', processImages, createMediaGlob('**/*.+(png|jpg)'));
	await addMedia('video', processVideos, createMediaGlob('**/*.mp4'));
};

processMedia();
