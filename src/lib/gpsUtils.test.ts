import { createGoogleMapsLink } from './gpsUtils';

describe('createGoogleMapsLink()', () => {
	test('creates expected link from gps exif data', () => {
		expect(createGoogleMapsLink({
			GPSLatitudeRef: 'N',
			GPSLatitude: [48, 12, 30],
			GPSLongitudeRef: 'E',
			GPSLongitude: [16, 22, 1],
		})).toBe('https://maps.google.com/maps?q=48°12\'30"N,16°22\'1"E');

		expect(createGoogleMapsLink({
			GPSLatitudeRef: 'S',
			GPSLatitude: [48, 12, 38],
			GPSLongitudeRef: 'W',
			GPSLongitude: [16, 22, 37],
		})).toBe('https://maps.google.com/maps?q=48°12\'38"S,16°22\'37"W');
	});
});
