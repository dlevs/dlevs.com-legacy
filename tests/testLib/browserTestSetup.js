'use strict';

const path = require('path');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
const { HOSTNAME } = require('./browserTestConstants');

function toMatchImageSnapshotModified(received, { ...args }) {
	return toMatchImageSnapshot.call(this, received, {
		customSnapshotsDir: path.resolve(__dirname, `../__image_snapshots__/${HOSTNAME}`),
		...args,
	});
}

expect.extend({
	toMatchImageSnapshot: toMatchImageSnapshotModified,
});
