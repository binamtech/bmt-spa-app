'use strict';

var users = require('../controllers/users.server.controller'),
	docs = require('../controllers/docs.server.controller'),
	express = require('express'),
	restApiPath = require('./../constants').RestApiPath;

module.exports = function (app) {

	var apiRoutes = express.Router();

	//Enable Cross Origin Resource Sharing
	apiRoutes.use(function(req, res, next) {
		// CORS headers
		res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
		res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
		// Set custom headers for CORS
		res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
		if (req.method === 'OPTIONS') {
			res.status(200).end();
		} else {
			next();
		}
	});

	apiRoutes.post('/signup', users.signup, users.create);

	// route to authenticate a user
	apiRoutes.post('/authenticate', users.authenticate);

	//only authenticated users allowed for next routes

	// route middleware to verify a token and role
	apiRoutes.use(users.validateToken);

	apiRoutes.post('/users', users.validateAdmin, users.create);
	apiRoutes.get('/users', users.validateAdmin, users.list);
	apiRoutes.get('/users/:userId', users.validateUser, users.read);
	apiRoutes.put('/users/:userId', users.validateUser, users.update);
	apiRoutes.delete('/users/:userId', users.validateUser, users.delete);
	apiRoutes.param('userId', users.userByID);

	//todo implement api for catalogs and documents
/*	apiRoutes.use(users.validateAdmin);
	apiRoutes.get('/catalogs', docs.list);                  //list of items for root folder
	apiRoutes.get('/catalogs/:catalogId', docs.list);       //list of items for specific folder
	apiRoutes.post('/catalogs', docs.create);               //create item (doc or folder) in root folder
	apiRoutes.post('/catalogs/:catalogId', docs.create);    //create item (doc or folder) in specific folder
	apiRoutes.put('/catalogs/:catalogId', docs.update);     //update folder
	apiRoutes.put('/docs/:docId', docs.update);             //update document
	apiRoutes.delete('/catalogs/:catalogId', docs.delete);  //delete folder
	apiRoutes.delete('/docs/:docId', docs.delete);          //delete document
	apiRoutes.param('catalogId', docs.catalogByID);
	apiRoutes.param('docId', docs.docByID);*/

	// apply the routes to our application with the prefix /api
	app.use(restApiPath, apiRoutes);
};