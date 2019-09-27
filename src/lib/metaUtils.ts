import { getShareUrl } from './urlUtils';
import { getImageMeta } from './mediaUtils';
import { SITE_NAME, SITE_LOCALE, SITE_IMAGE } from './constants';
import { OpenGraphMeta } from './types';

/**
 * Returns an object with key/value pairs to use for og metatags:
 * <meta property="og:{key}" content="{value}"/>
 *
 * Some default values are provided, and title and description may be
 * taken from the `meta` if not defined in `meta.og`.
 */

export const expandOpenGraphMeta = ({
	title,
	description,
	url,
	og = {},
}: {
	title: string;
	description: string;
	url: string;
	og: OpenGraphMeta;
}) => {
	const expanded = {
		'og:title': title,
		'og:description': description,
		'og:url': url && getShareUrl(url),
		'og:type': 'website',
		'og:image': getImageMeta(SITE_IMAGE).versions.large,
		'og:site_name': SITE_NAME,
		'og:locale': SITE_LOCALE.replace('-', '_'),
		...og,
	};

	// Image is not a string. It is an object containing image meta. Expand.
	if (expanded['_og:image']) {
		const {
			absoluteSrc,
			width,
			height,
			type,
		} = expanded['_og:image'];

		expanded['og:image'] = absoluteSrc;
		expanded['og:image:width'] = width;
		expanded['og:image:height'] = height;
		expanded['og:image:type'] = type;
	}

	return expanded;
};