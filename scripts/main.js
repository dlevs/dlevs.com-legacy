import './includes/recordErrors';
import './includes/elementClosestPolyfill';
import 'lazysizes';
import { init as initInstantclick } from './includes/vendor/instantclick';
import { init as initPhotoswipe } from './includes/photoswipe';
import { init as initGoogleAnalytics } from './includes/googleAnalytics';

initInstantclick();
initPhotoswipe();
initGoogleAnalytics();
