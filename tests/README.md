## Testing overview
Unit tests are located alongside the code it is testing - `foo.test.js` tests `foo.js`.

Browser tests work the same way - `sitemapController.browsertest.js` tests `sitemapController.js`.

See the [main README file](../README.md)
 for information on running tests.

## This directory
This directory is for all `*.browsertest.js` files which cannot be neatly be matched with a file that is responsible for the thing being tested.

TODO: Puppeteer is used for testing. Upgrading to the latest version causes CSP errors, so tests fail. Consider upgrading after this issue is resolved. https://github.com/GoogleChrome/puppeteer/issues/1229
