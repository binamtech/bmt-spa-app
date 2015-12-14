'use strict';

var config = require('./config'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session');

module.exports = function () {
	var app = express();

	app.set('jwtSecret', config.jwtSecret);

	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}
	console.log(process.env.NODE_ENV);
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	if (process.env.NODE_ENV === 'development') {
		app.use(session({
			saveUninitialized: true,
			resave: true,
			secret: config.sessionSecret
		}));
	}

	// allows index.html.ejs to see if we're running in production
	app.locals.production = (process.env.NODE_ENV === 'production');

	app.set('views', './app/views');
	app.set('view engine', config.viewEngine);

	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/api.v1.server.routes.js')(app);

	if (process.env.NODE_ENV === 'production') {
		app.use(express.static('./public'));
	} else {
		app.use(express.static('./src'));
	}

	return app;
};