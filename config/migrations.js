/*
* This is migration config for "mongoose-data-migrate"
* Using:
* for windows: set NODE_ENV=env&&mongoose-data-migrate up
* for linux: NODE_ENV=env mongoose-data-migrate up
 */

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config');

module.exports = {
// The location of the the mongoose module. Since mongoose-data-migrate
// needs to make a connection to mongodb, if you point to it here you'll
// be able to use the same connection in your migration files rather
// than creating a new connection.
	mongoose: '../node_modules/mongoose',

// mongodb connection string in mongoose format:
// 'mongodb://username:password@host:port/database?options...'
// See: http://mongoosejs.com/docs/connections.html
	db: config.db,

// Name of the collection where the status of migrations
// are stored (defaults to 'migrations')
	collection: 'migrations'
};