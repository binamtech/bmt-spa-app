'use strict';

var User = require('mongoose').model('User'),
	jwt = require('jsonwebtoken'),
	config = require('./../../config/config');

exports.authenticate = function (req, res) {

	if (!req.body.username || !req.body.password) {
		return res.status(401).json({ success: false, message: 'Authentication failed. Empty username or password.' });
	}

	// find the user
	User.findOne({
		//email: req.body.email
		username: req.body.username
	}, function(err, user) {
		if (err) {
			return res.status(500).json({ success: false, message: 'Oops something went wrong.', error: err });
		}
		if (!user) {
			return res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			// check if password matches
			if (!user.authenticate(req.body.password)) {
				//res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				return res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {
				// if user is found and password is right
				var profile = {
					id:	user.id,
					firstName: user.firstName,
					lastName: user.lastName,
					fullName: user.fullName,
					email: user.email,
					username: user.username,
					role: user.role
				};
				// create a token
				var token = jwt.sign({id: user.id}, config.jwtSecret, {expiresIn: 60*1440}); //expires in 24 hours
				// return the information including token as JSON
				return res.json({
					success: true,
					user: profile,
					token: token
				});
			}
		}
	});
};

//Authorize user
//possible roles = ['Admin', 'User']
function authorizeUser(user) {
	return user.role === 'Admin';
}

//todo implement token storage and invalidation after changing user's params
exports.validateToken = function (req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.jwtSecret, function(err, decoded) {
			if (err) {
				//JsonWebTokenError
				//TokenExpiredError
				if (err.name === 'TokenExpiredError') {
					return res.status(419).json({
						success: false,
						message: 'Token is expired.'});
				} else {
					return res.status(401).json({
						success: false,
						message: 'Failed to authenticate token.'});
				}
			} else {
				// Authorize the user to see if s/he can access our resources
				User.findOne({
					_id: decoded.id
				}, function(err, user) {
					if (err) {
						return res.status(500).json({ success: false, message: 'Oops something went wrong.', error: err });
					}
					if (!user) {
						return res.status(401).json({ success: false, message: 'Invalid User.' });
					}
					req.authUser = user;
					next();
				});
			}
		});
	} else {
		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
};

exports.validateUser = function (req, res, next) {
	if ((req.authUser && authorizeUser(req.authUser)) ||
			(req.authUser && req.user && req.authUser.id === req.user.id)) {
		next();
	} else {
		return res.status(403).json({ success: false, message: 'Not Authorized.' });
	}
};

exports.validateAdmin = function (req, res, next) {
	if (req.authUser && authorizeUser(req.authUser)) {
		next();
	} else {
		return res.status(403).json({ success: false, message: 'Not Authorized.' });
	}
};

var getErrorMessage = function (err) {
	var message = '';
	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) {
				message = err.errors[errName].message;
			}
		}
	}
	return message;
};

exports.signup = function (req, res, next) {
	if (req.body && (req.body.role !== 'User')) {
		req.body.role = 'User';
	}
	next();
};

exports.create = function (req, res) {
	var newUser = new User(req.body);
	newUser.save(function (err, user) {
		if (err) {
			var message = getErrorMessage(err);
			return res.status(500).json({ success: false, message: message });
		} else {
			var profile = {
				id:	user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				fullName: user.fullName,
				email: user.email,
				username: user.username,
				role: user.role
			};
			res.json({ success: true, user: profile });
		}
	});
};

exports.list = function (req, res, next) {
	User.find({}, '-password -salt -provider', function (err, users) {
		if (err) {
			return next(err);
		} else {
			res.json(users);
		}
	});
};

exports.read = function (req, res) {
	var user = req.user;
	var profile = {
		id:	user.id,
		firstName: user.firstName,
		lastName: user.lastName,
		fullName: user.fullName,
		email: user.email,
		username: user.username,
		role: user.role
	};
	res.json(profile);
};

exports.userByID = function (req, res, next) {
	User.findOne({
		_id: req.params.userId
	}, function (err, user) {
		if (err) {
			return next(err);
		} else {
			req.user = user;
			next();
		}
	});
};

exports.update = function (req, res) {
	var userBody = req.body || {};
	if (req.user) {
		var user = req.user;
		for(var key in userBody){
			if (userBody.hasOwnProperty(key)) {
				if (key === 'role' && user[key] !== userBody[key] && !authorizeUser(req.authUser)) {
					//not allow users to change role, Admins can only
					continue;
				}
				user[key] = userBody[key];
			}
		}
		user.save(function (err) {
			if (err) {
				var message = getErrorMessage(err);
				return res.status(500).json({ success: false, message: message });
			} else {
				res.json({
					success: true
				});
			}
		});
	}
};

exports.delete = function (req, res) {
	req.user.remove(function (err) {
		if (err) {
			var message = getErrorMessage(err);
			return res.status(500).json({ success: false, message: message });
		} else {
			res.json({
				success: true,
				user: req.user
			});
		}
	});
};
