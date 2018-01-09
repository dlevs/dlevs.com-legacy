'use strict';

const { getImageMeta } = require('./imageUtils');
const { SITE_NAME, SITE_LOCALE, SITE_IMAGE } = require('./constants');

/**
 * Meta data used to populate HTML meta tags.
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
		title,
		description,
		url,
		type: 'website',
		image: getImageMeta(SITE_IMAGE).large,
		site_name: SITE_NAME,
		locale: SITE_LOCALE,
		...og,
	};

	// Image is not a string. It is an object containing image meta. Expand.
	if (expanded.image && expanded.image.src) {
		const { absoluteSrc, width, height } = expanded.image;

		expanded.image = absoluteSrc;
		expanded['image:width'] = width;
		expanded['image:height'] = height;
	}

	return expanded;
};
