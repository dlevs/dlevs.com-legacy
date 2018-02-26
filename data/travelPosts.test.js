'use strict';

const Breadcrumb = require('../lib/Breadcrumb');
const { getPosts } = require('./travelPosts');

const testPosts = [
	{
		country: 'India',
		town: 'Delhi',
		date: '2016-01-02',
		images: [
			{
				src: '/images/travel/india/image_1.jpg',
				arbitraryProp: 'foo',
			},
			{
				src: '/images/travel/india/image_2.jpg',
				arbitraryProp: 'foo',
			},
		],
	},
	{
		country: 'England',
		town: 'London',
		date: '2017-09-23',
		images: [
			{
				src: '/images/travel/england/image_1.jpg',
				arbitraryProp: 'foo',
			},
		],
	},
	{
		// Most recent, but with last town alphabetically. To test sorting.
		country: 'Vietnam',
		town: 'Vung Tau',
		date: '2018-09-23',
		images: [
			{
				src: '/images/travel/vietnam/image_1.jpg',
				arbitraryProp: 'foo',
			},
		],
	},
	{
		country: 'India',
		town: 'Agra',
		date: '2016-01-03',
		images: [
			{
				src: '/images/travel/india/image_3.jpg',
				arbitraryProp: 'foo',
			},
		],
	},
];

describe('getPosts()', () => {
	const { posts, postsByCountry } = getPosts(
		{ breadcrumbRoot: new Breadcrumb([{ name: 'Home', slug: '' }]) },
		testPosts,
	);

	describe('posts', () => {
		test('are expanded correctly', () => {
			expect(posts.length).toBe(4);
			expect(posts[0]).toMatchObject({
				countrySlug: 'vietnam',
				townSlug: 'vung-tau',
				path: '/vietnam/vung-tau',
				humanDate: 'September 2018',
				mainImage: {
					src: '/images/travel/vietnam/image_1.jpg',
					arbitraryProp: 'foo',
					geoLocation: 'Vung Tau, Vietnam',
				},
				country: 'Vietnam',
				town: 'Vung Tau',
				date: '2018-09-23',
				images: [
					{
						src: '/images/travel/vietnam/image_1.jpg',
						arbitraryProp: 'foo',
						geoLocation: 'Vung Tau, Vietnam',
					},
				],
			});
		});

		test('are sorted by most recent date', () => {
			expect(posts).toMatchObject([
				{
					town: 'Vung Tau',
					date: '2018-09-23',
				},
				{
					town: 'London',
					date: '2017-09-23',
				},
				{
					town: 'Agra',
					date: '2016-01-03',
				},
				{
					town: 'Delhi',
					date: '2016-01-02',
				},
			]);
		});
	});

	describe('postsByCountry', () => {
		test('are grouped by country and expanded correctly', () => {
			expect(postsByCountry.length).toBe(3);
			expect(postsByCountry[0]).toMatchObject({
				country: 'England',
				countrySlug: 'england',
				path: '/england',
				images: [
					{
						src: '/images/travel/england/image_1.jpg',
						arbitraryProp: 'foo',
						geoLocation: 'London, England',
					},
				],
				mainImage: {
					src: '/images/travel/england/image_1.jpg',
					arbitraryProp: 'foo',
					geoLocation: 'London, England',
				},
			});
		});

		test('are sorted in alphabetical order by country', () => {
			expect(postsByCountry).toMatchObject([
				{ country: 'England' },
				{ country: 'India' },
				{ country: 'Vietnam' },
			]);
		});

		test('have posts defined', () => {
			expect(postsByCountry[0].posts.length).toBe(1);
			expect(postsByCountry[0].posts[0].town).toBe('London');
		});
	});
});
