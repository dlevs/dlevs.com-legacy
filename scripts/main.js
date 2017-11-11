import './includes/recordErrors';
// eslint-disable-next-line import/first
import 'lazysizes';
import './includes/elementClosestPolyfill';
import { init as initInstantclick } from './includes/vendor/instantclick';
import initPhotoswipe from './includes/photoswipe';
import initGoogleAnalytics from './includes/googleAnalytics';

initInstantclick();
initPhotoswipe();
initGoogleAnalytics();
