const path = require('path');
const { toMatchImageSnapshot } = require('jest-image-snapshot');
const { HOSTNAME } = require('./testConstants');

function toMatchImageSnapshotModified(received, { ...args }) {
	return toMatchImageSnapshot.call(this, received, {
		customSnapshotsDir: path.resolve(__dirname, `../imageSnapshots/${HOSTNAME}`),
		...args,
	});
}

expect.extend({
	toMatchImageSnapshot: toMatchImageSnapshotModified,
});
