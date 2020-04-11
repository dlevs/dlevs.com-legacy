import mapValues from 'lodash/mapValues';
import images from '/data/generated/images.json';
import { getRevvedPath } from '/lib/assetUtils';
import { MapOf } from './types';

interface ImageMeta {
	type: 'image';
	mapLink: string | null;
	versions: {
		large: ImageVersionMeta;
		default: ImageVersionMeta;
		largeWebp: ImageVersionMeta;
		defaultWebp: ImageVersionMeta;
	};
}

interface ImageVersionMeta {
	width: number;
	height: number;
	format: string;
	type: string;
	src: string;
	paddingBottom: string;
}

export const createImgSrcset = (...images: ImageVersionMeta[]) =>
	images.map(({ src, width }) => `${src} ${width}w`).join(', ');

export const getImageMeta = (filepath: string) => {
	const meta = (images as MapOf<ImageMeta>)[filepath];

	if (!meta) {
		throw new Error(`No meta found for filepath "${filepath}"`);
	}

	return {
		...meta,
		versions: mapValues(
			meta.versions,
			(version) => {
				const revvedSrc = getRevvedPath(version.src);
				return {
					...version,
					src: revvedSrc,
					absoluteSrc: `${process.env.ORIGIN}${revvedSrc}`,
				};
			},
		),
	};
};
