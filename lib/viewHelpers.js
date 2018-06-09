'use strict';

const classnames = require('classnames');
const { createImgSrcset, getMediaMeta } = require('./mediaUtils');
const { getRevvedPath } = require('./assetUtils');
const { immutableExtend } = require('./objectUtils');
const { expandOpenGraphMeta } = require('./metaUtils');

module.exports = {
	classnames,
	createImgSrcset,
	getMediaMeta,
	getRevvedPath,
	immutableExtend,
	expandOpenGraphMeta,
};
