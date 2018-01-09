'use strict';

const path = require('path');

exports.root = (...args) => path.resolve(__dirname, '../', ...args);
exports.relativeToRoot = filepath => path.relative(exports.root('./'), filepath);
