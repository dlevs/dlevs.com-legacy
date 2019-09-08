type GPSCoordinate = [number, number, number]
type LongitudeRef = 'E' | 'W'
type LatitudeRef = 'N' | 'S'

/** Output from "exif-reader" npm package */
interface GPSData {
	GPSLatitudeRef: LatitudeRef;
	GPSLatitude: GPSCoordinate;
	GPSLongitudeRef: LongitudeRef;
	GPSLongitude: GPSCoordinate;
	GPSAltitudeRef: number;
	GPSAltitude: number;
	GPSTimeStamp: GPSCoordinate;
	GPSSpeedRef: 'K' | 'M' | 'N';
	GPSSpeed: number;
	GPSImgDirectionRef: 'T' | 'M';
	GPSImgDirection: number;
	GPSDestBearingRef: 'T' | 'M';
	GPSDestBearing: number;
	GPSDateStamp: string;
}

/**
 * Format degree, minute and second coordinates for use in a Google Maps URL.
 */
const gpsCoordsToString = (
	[degrees, minutes, seconds]: GPSCoordinate,
	ref: LongitudeRef | LatitudeRef,
) =>
	`${degrees}°${minutes}'${seconds}"${ref}`;

/**
 * Creates a Google Maps URL from the raw GPS Exif data from a photo.
 */
export const createGoogleMapsLink = ({
	GPSLatitude,
	GPSLatitudeRef,
	GPSLongitude,
	GPSLongitudeRef,
}: GPSData) => {
	const latitude = gpsCoordsToString(GPSLatitude, GPSLatitudeRef);
	const longitude = gpsCoordsToString(GPSLongitude, GPSLongitudeRef);

	return `https://maps.google.com/maps?q=${latitude},${longitude}`;
};
