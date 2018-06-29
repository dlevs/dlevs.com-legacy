# Testing

## Overview

| Command | Description |
| --- | --- |
| `npm test` | Run unit tests. Includes all files ending with `.test.js`. |
| `npm run test:browser` | Run tests against a server. Includes all files ending with `.browsertest.js`. Needs some environment variables to be defined. |

## Browser tests

Some variables need to be passed to `npm run test:browser`:

| Command | Description |
| --- | --- |
| `env TEST_HOSTNAME=localhost:3000 npm run test:browser` | Runs tests against localhost |
| `env TEST_HOSTNAME=dlevs.com npm run test:browser` | Runs tests against production |
| `env TEST_HOSTNAME=staging.dlevs.com TEST_USERNAME=foo TEST_PASSWORD=bar npm run test:browser` | Runs tests against staging |
| `env TEST_HOSTNAME=dlevs.com npm run test:browser -- sitemap` | Runs only tests with "sitemap" in the filename |
| `env TEST_HOSTNAME=dlevs.com npm run test:browser -- --updateSnapshot` | Runs tests and updates the screenshots in `/tests/imageSnapshots/<HOSTNAME>`. Manually check these to ensure rendering is correct. All subsequent usages of `npm run test:browser` will compare the current UI to these screenshots, until running again with the `--updateSnapshot` flag. This can highlight UI regression. |

[back](../README.md)
