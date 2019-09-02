import R from 'ramda';
import moment from 'moment';
import kebabCase from 'lodash/kebabCase';
import rawPostsData from '../data/travelPostsRaw.json';
import Breadcrumb from '../lib/Breadcrumb.js';

interface Options {
	breadcrumbRoot: Breadcrumb;
}

// TODO: How much of this should be defined elsewhere? E.g. this has _all_ of the
// properties of sitemapController's "Page" type.
interface Post extends PostSource {
	name: string;
	countrySlug: string;
	townSlug: string;
	breadcrumb: Breadcrumb;
	path: string;
	humanDate: string;
	description: string;
	author: string;
	images: PostImage[];
	mainImage: PostImage;
	datePublished: string;
	dateModified: string;
}

interface PostSource {
	country: string;
	town: string;
	date: string;
	datePublished?: string;
	dateModified?: string;
	images: PostImage[];
}

// TODO: Make generic ImageMeta type?
interface PostImage {
	src: string;
	caption: string;
	alt: string;
}

// TODO: Rambda is being used here as the TypeScript support seems better.
// TODO: If it _is_ better, remove lodash in favour of Rambda.
const expandPosts = ({ breadcrumbRoot }: Options) => R.pipe(
	R.map((post: PostSource): Post => {
		const countrySlug = kebabCase(post.country);
		const townSlug = kebabCase(post.town);
		const breadcrumb = breadcrumbRoot.append([
			{
				slug: countrySlug,
				name: post.country,
			},
			{
				slug: townSlug,
				name: post.town,
			},
		]);
		const datePublished = post.datePublished || post.date;
		const images = post.images.map(image => ({
			...image,
			geoLocation: `${post.town}, ${post.country}`,
		}));

		return {
			name: post.town,
			countrySlug,
			townSlug,
			breadcrumb,
			path: breadcrumb.path,
			humanDate: moment(post.date).format('MMMM YYYY'),
			description: `Photos from ${post.town}, ${post.country}.`,
			author: process.env.ORIGIN,
			mainImage: images[0],
			...post,
			datePublished,
			dateModified: post.dateModified || datePublished,
			images,
		};
	}),
	R.sortBy(R.prop('date')),
);

const groupPostsByCountry = ({ breadcrumbRoot }: Options) => R.pipe(
	(posts: Post[]) => posts, // TODO: Just being lazy. Is there a better way to assert the expected input of a R.pipe?
	R.groupBy(R.prop('country')),
	R.map((posts: Post[]) => {
		const { country, countrySlug } = posts[0];
		const breadcrumb = breadcrumbRoot.append([
			{
				slug: countrySlug,
				name: country,
			},
		]);
		const images = posts.map(({ mainImage }) => mainImage);
		return {
			name: country,
			country,
			countrySlug,
			breadcrumb,
			path: breadcrumb.path,
			description: `Photos from ${country}.`,
			author: process.env.ORIGIN,
			posts,
			images,
			mainImage: images[0],
		};
	}),
	R.sortBy(R.prop('country')),
);

/**
 * Get an array of travel posts, expanded with URL paths, human-readable dates,
 * etc.
 *
 * The generated URLs are relative to the `options.breadcrumbRoot` property.
 *
 * The optional second parameter allows for testing.
 */
export const getPosts = (
	options: Options,
	rawPosts: PostSource[] = rawPostsData,
) => {
	const posts = expandPosts(options)(rawPosts);
	const postsByCountry = groupPostsByCountry(options)(posts);

	return { posts, postsByCountry };
};
