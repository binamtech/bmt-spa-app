'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
	mongoose = require('./config/mongoose'),
	express = require('./config/express');

mongoose();
var app = express();

app.listen(config.port);

module.exports = app;

console.log('Server running at http://localhost:'+config.port+'/');