import { root } from '/lib/pathUtils';
import { addMedia } from './buildUtils';
import processImages from './processImages';
import processSvgs from './processSvgs';

const createMediaGlob = (pattern: string) =>
	root('./publicSrc/process/media', pattern);

const processMedia = async () => {
	await addMedia('SVG', processSvgs, createMediaGlob('**/*.svg'));
	await addMedia('image', processImages, createMediaGlob('**/*.+(png|jpg)'));
};

processMedia();
