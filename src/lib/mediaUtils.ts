import mapValues from 'lodash/mapValues';
import media from '@root/data/generated/media.json';
import { getRevvedPath } from '@root/lib/assetUtils';
import { MapOf } from './types';

// TODO: Maybe define this in a shared place, where the data is generated:
type ImageMetaMap = MapOf<RasterImageMeta | SVGImageMeta>

interface RasterImageMeta {
	type: 'image';
	mapLink: string | null;
	versions: {
		large: ImageVersionMeta;
		default: ImageVersionMeta;
		largeWebp: ImageVersionMeta;
		defaultWebp: ImageVersionMeta;
	};
}

interface SVGImageMeta {
	type: 'svg';
	versions: {
		default: {
			src: string;
		};
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

/**
 * For a filepath, get meta for all versions of that image.
 */
export const getMediaMeta = (filepath: string) => {
	const meta = (media as ImageMetaMap)[filepath];

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
