import { icons as ICONS } from 'feather-icons';
import * as CONSTANTS from './constants';
import HELPERS from './viewHelpers';

export default {
	HELPERS,
	ICONS,
	GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
	CONSTANTS,
	DEBUG: process.env.NODE_ENV !== 'production',
};
