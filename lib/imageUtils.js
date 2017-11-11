// @flow

type ImageMeta = {
	width: number,
	height: number,
	format: string,
	src: string,
	paddingBottom: string,
};

exports.createImgSrcset = (...images: Array<ImageMeta>): string => images
	.map(({ src, width }) => `${src} ${width}w`)
	.join(', ');
