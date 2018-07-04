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

## Snapshots

Jest will store snapshots in `__snapshots__` and `__image_snapshots__` directories. For unit tests, these are normally JSON objects. For the browser tests, these are screenshots. Jest will highlight where differences exist in the snapshots since the last time the tests were run. They're good for catching regression.

To update the snapshots, run the tests with the `-u` flag: `npm run test -- -u`.

## Coverage

A test coverage report is generated when running `npm build`. You can [view the coverage report on the site](https://dlevs.com/coverage).

[back](../README.md)
