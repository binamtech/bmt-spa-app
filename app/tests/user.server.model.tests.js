'use strict';

require('../../server.js');

var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');

var user;

describe('User Model Unit Tests:', function() {

	before(function(done) {
		User.remove(function() {
			done();
		});
	});

	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});
		done();
	});

	describe('Testing the save method', function() {
		it('Should be able to save without problems', function(done) {
			user.save(function(err) {
				should.not.exist(err);
				done();
			});
		});
		it('Should not be able to save a user without an username',
			function(done) {
				user.username = '';
				user.save(function(err) {
					should.exist(err);
					done();
				});
			});
		it('Should not be able to save users with the same usernames',
				function(done) {
					var newUser = new User({
							firstName: 'Full',
							lastName: 'Name',
							displayName: 'Full Name',
							email: 'test@test.com',
							username: 'username',
							password: 'password'
						});
					user.save(function(err) {
						should.not.exist(err);
						newUser.save(function(err) {
							should.exist(err);
							done();
						});
					});
				});
		it('Should hashed password after saving', function(done) {
			user.save(function() {
				user.should.have.property('password');
				user.should.have.property('salt');
				var hashPassword = user.hashPassword('password');
				user.password.should.be.exactly(hashPassword);
				done();
			});
		});
	});

	afterEach(function(done) {
		User.remove(function() {
			done();
		});
	});
});
