const {getPosts} = require('./travelPosts');

const testPosts = [
	{
		country: 'India',
		town: 'Delhi',
		date: '2016-01-02',
		images: [
			{
				src: '/images/travel/india/image_1.jpg',
				arbitraryProp: 'foo'
			},
			{
				src: '/images/travel/india/image_2.jpg',
				arbitraryProp: 'foo'
			}
		]
	},
	{
		country: 'England',
		town: 'London',
		date: '2017-09-23',
		images: [
			{
				src: '/images/travel/england/image_1.jpg',
				arbitraryProp: 'foo'
			}
		]
	},
	{
		// Most recent, but with last town alphabetically. To test sorting.
		country: 'Zzz',
		town: 'Zzz Town',
		date: '2018-09-23',
		images: [
			{
				src: '/images/travel/zzz/image_1.jpg',
				arbitraryProp: 'foo'
			}
		]
	},
	{
		country: 'India',
		town: 'Agra',
		date: '2016-01-03',
		images: [
			{
				src: '/images/travel/india/image_3.jpg',
				arbitraryProp: 'foo'
			}
		]
	}
];

describe('getPosts()', () => {
	const {posts, postsByCountry} = getPosts(
		{breadcrumbRoot: [{label: 'Home'}]},
		testPosts
	);

	describe('posts', () => {
		test('are expanded correctly', () => {
			expect(posts.length).toBe(4);
			expect(posts[0]).toMatchObject({
				countrySlug: 'zzz',
				townSlug: 'zzz-town',
				breadcrumb: [
					{
						label: 'Home',
						slug: '',
						path: '/'
					},
					{
						label: 'Zzz',
						slug: 'zzz',
						path: '/zzz'
					},
					{
						label: 'Zzz Town',
						slug: 'zzz-town',
						path: '/zzz/zzz-town'
					}
				],
				path: '/zzz/zzz-town',
				humanDate: 'September 2018',
				mainImage: {
					src: '/images/travel/zzz/image_1.jpg',
					arbitraryProp: 'foo',
					geoLocation: 'Zzz Town, Zzz'
				},
				country: 'Zzz',
				town: 'Zzz Town',
				date: '2018-09-23',
				images: [
					{
						src: '/images/travel/zzz/image_1.jpg',
						arbitraryProp: 'foo',
						geoLocation: 'Zzz Town, Zzz'
					}
				]
			});
		});

		test('are sorted by most recent date', () => {
			// TODO: See if jest has a "match" function for partial matches
			expect(posts[0].town).toBe('Zzz Town');
			expect(posts[0].date).toBe('2018-09-23');

			expect(posts[1].town).toBe('London');
			expect(posts[1].date).toBe('2017-09-23');

			expect(posts[2].town).toBe('Agra');
			expect(posts[2].date).toBe('2016-01-03');

			expect(posts[3].town).toBe('Delhi');
			expect(posts[3].date).toBe('2016-01-02');
		});
	});

	describe('postsByCountry', () => {
		test('are grouped by country and expanded correctly', () => {
			expect(postsByCountry.length).toBe(3);
			expect(postsByCountry[0]).toMatchObject({
				country: 'England',
				countrySlug: 'england',
				breadcrumb: [
					{
						label: 'Home',
						slug: '',
						path: '/'
					},
					{
						label: 'England',
						slug: 'england',
						path: '/england'
					}
				],
				path: '/england',
				images: [
					{
						src: '/images/travel/england/image_1.jpg',
						arbitraryProp: 'foo',
						geoLocation: 'London, England'
					}
				],
				mainImage: {
					src: '/images/travel/england/image_1.jpg',
					arbitraryProp: 'foo',
					geoLocation: 'London, England'
				}
			});

		});

		test('are sorted in alphabetical order by country', () => {
			expect(postsByCountry[0].country).toBe('England');
			expect(postsByCountry[1].country).toBe('India');
			expect(postsByCountry[2].country).toBe('Zzz');
		});

		test('have posts defined', () => {
			expect(postsByCountry[0].posts.length).toBe(1);
			expect(postsByCountry[0].posts[0].town).toBe('London');
		});
	});
});
