'use strict';

import path from 'path';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import { HOSTNAME } from './browserTestConstants';

function toMatchImageSnapshotModified(received, options, ...args) {
	return toMatchImageSnapshot.call(
		this,
		received,
		{
			customSnapshotsDir: path.resolve(__dirname, `../__image_snapshots__/${HOSTNAME}`),
			...options,
		},
		...args,
	);
}

expect.extend({
	toMatchImageSnapshot: toMatchImageSnapshotModified,
});
