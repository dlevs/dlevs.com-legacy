import moment from 'moment';
import orderBy from 'lodash/fp/orderBy';
import flow from 'lodash/flow';
import kebabCase from 'lodash/kebabCase';
import sortBy from 'lodash/fp/sortBy';
import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';
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

type ExpandPosts = (posts: PostSource[]) => Post[]

const expandPost = ({ breadcrumbRoot }: Options) =>
	(post: PostSource): Post => {
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
	}

const expandPosts = (options: Options): ExpandPosts => flow(
	map(expandPost(options)),
	orderBy('date', 'desc'),
);

const groupPostsByCountry = ({ breadcrumbRoot }: Options) => flow(
	groupBy('country'),
	map((posts: Post[]) => {
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
	sortBy('country'),
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
