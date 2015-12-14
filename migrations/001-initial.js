'use strict';

require('../app/models/user.server.model');

var User = require('mongoose').model('User');

exports.up = function (next) {
	console.log('    --> This is migration 001-initial.js being applied');

	User.findOne({
		role: 'Admin'
	}, function(err, user) {
		if (err) {
			return next(err);
		} else {
			if (!user) {
				//add user with admin role
				var adminUser = new User({
					username: 'admin',
					password: '111111',
					role: 'Admin'
				});
				adminUser.save(function (err, user) {
					if (err) {
						return next(err);
					} else {
						console.log(user);
						return next();
					}
				});
			} else {
				return next(new Error('User with "Admin" role already exists.'));
			}
		}
	});
};

exports.down = function (next) {
	console.log('    --> This is migration 001-initial.js being rollbacked');
	next();
};
