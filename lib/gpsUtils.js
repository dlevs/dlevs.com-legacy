// @flow

type GPSData = {
	GPSLatitude: Array<number>,
	GPSLatitudeRef: string,
	GPSLongitude: Array<number>,
	GPSLongitudeRef: string,
};

/**
 * Format degree, minute and second coordinates for use in a Google Maps URL.
 *
 * @param {Array} coordinate
 * @param {String} ref
 */
const gpsCoordsToString = ([degrees, minutes, seconds], ref) =>
	`${degrees}°${minutes}'${seconds}"${ref}`;

/**
 * Creates a Google Maps URL from the raw GPS Exif data from a photo.
 */
exports.createGoogleMapsLink = ({
	GPSLatitude,
	GPSLatitudeRef,
	GPSLongitude,
	GPSLongitudeRef,
}: GPSData): string => {
	const latitude = gpsCoordsToString(GPSLatitude, GPSLatitudeRef);
	const longitude = gpsCoordsToString(GPSLongitude, GPSLongitudeRef);

	return `https://maps.google.com/maps?q=${latitude},${longitude}`;
};
