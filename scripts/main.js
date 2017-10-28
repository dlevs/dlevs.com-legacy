import './includes/recordErrors';
import './includes/elementClosestPolyfill';
import 'lazysizes';
import { init as initInstantclick } from 'instantclick';
import { init as initReadMore } from './includes/readMore';
import { init as initPhotoswipe } from './includes/photoswipe';
import { init as initGoogleAnalytics } from './includes/googleAnalytics';

initInstantclick();
initReadMore();
initPhotoswipe();
initGoogleAnalytics();
