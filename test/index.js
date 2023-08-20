var tap = require('tap');
var air = require('../index.js');

// api
tap.ok(air.getFile);
tap.ok(air.getFilePath);

// assertions
tap.match(air.getFilePath('air.min.css'), /air\.min\.css/, 'should return file path');
tap.throws(air.getFile, new Error('undefined does not exist'));
