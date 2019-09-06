import { getShareUrl } from './urlUtils';
import { getMediaMeta } from './mediaUtils';
import { SITE_NAME, SITE_LOCALE, SITE_IMAGE } from './constants';

/**
 * Meta data used to populate HTML meta tags.
 * // TODO: Update to typescript type
 *
 * @typedef {Object} PageMeta
 * @property {String} title - populates <title>
 * @property {String} description - populates <meta name="description"/>
 * @property {String} url - canonical URL for the page
 * @property {Object} og - key/value pairs to populate <meta property="og:{key}" content="{value}"/>
 */

/**
 * Returns an object with key/value pairs to use for og metatags:
 * <meta property="og:{key}" content="{value}"/>
 *
 * Some default values are provided, and title and description may be
 * taken from the `meta` if not defined in `meta.og`.
 *
 * @param {PageMeta} meta
 */
exports.expandOpenGraphMeta = ({
	title,
	description,
	url,
	og = {},
}) => {
	const expanded = {
		'og:title': title,
		'og:description': description,
		'og:url': url && getShareUrl(url),
		'og:type': 'website',
		'og:image': getMediaMeta(SITE_IMAGE).versions.large,
		'og:site_name': SITE_NAME,
		'og:locale': SITE_LOCALE.replace('-', '_'),
		...og,
	};

	// Image is not a string. It is an object containing image meta. Expand.
	if (expanded['og:image'] && expanded['og:image'].src) {
		const {
			absoluteSrc,
			width,
			height,
			type,
		} = expanded['og:image'];

		expanded['og:image'] = absoluteSrc;
		expanded['og:image:width'] = width;
		expanded['og:image:height'] = height;
		expanded['og:image:type'] = type;
	}

	return expanded;
};
