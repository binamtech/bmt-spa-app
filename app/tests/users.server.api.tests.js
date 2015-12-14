'use strict';

var app = require('../../server'),
	request = require('supertest'),
	//should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	jwt = require('jsonwebtoken'),
	config = require('./../../config/config'),
	restApiPath = require('./../constants').RestApiPath;

var user, admin, userToken, adminToken;
var restApiUserPath = restApiPath + '/users/';

describe('Users Controller Unit Tests:', function() {
	before(function(done) {
		User.remove().exec();
		done();
	});
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password',
			role: 'User'
		});
		user.save(function() {
			userToken = jwt.sign({id: user.id}, config.jwtSecret, {expiresIn: 60*60});
			done();
		});
	});
	beforeEach(function(done) {
		admin = new User({
			email: 'admin@test.com',
			username: 'admin',
			password: 'password',
			role: 'Admin'
		});
		admin.save(function() {
			adminToken = jwt.sign({id: admin.id}, config.jwtSecret, {expiresIn: 60*60});
			done();
		});
	});

	describe('Testing authentication', function() {
		it('Should not get the list of users for not authenticated user', function(done) {
			request(app).get(restApiUserPath)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(401)
				.end(function(err, res) {
					res.body.should.have.property('success',false);
					done();
				});
		});
		it('Should not get the list of users for not Admin user', function(done) {
			request(app).get(restApiUserPath)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect('Content-Type', /json/)
				.expect(403)
				.end(function(err, res) {
					res.body.should.have.property('success',false);
					done();
				});
		});
	});

	describe('Testing the GET methods', function() {
		it('Should be able to get the list of users', function(done){
			request(app).get(restApiUserPath)
				.set('Accept', 'application/json')
				.set('x-access-token', adminToken)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					res.body.should.be.instanceof(Array).and.have.lengthOf(2);
					res.body[0].should.have.property('firstName', user.firstName);
					res.body[0].should.have.property('lastName', user.lastName);
					res.body[0].should.have.property('fullName', user.fullName);
					res.body[0].should.have.property('email', user.email);
					res.body[0].should.have.property('username', user.username);
					res.body[0].should.have.property('role', user.role);
					res.body[0].should.not.have.property('password');
					res.body[0].should.not.have.property('salt');
					done();
				});
		});
		it('Should be able to get the specific user', function(done) {
			request(app).get(restApiUserPath + user.id)
				.set('Accept', 'application/json')
				.set('x-access-token', userToken)
				.expect('Content-Type', /json/)
				.expect(200)
				.end(function(err, res) {
					res.body.should.be.instanceof(Object);
					res.body.should.have.property('firstName', user.firstName);
					res.body.should.have.property('lastName', user.lastName);
					res.body.should.have.property('fullName', user.fullName);
					res.body.should.have.property('email', user.email);
					res.body.should.have.property('username', user.username);
					res.body.should.have.property('role', user.role);
					res.body.should.not.have.property('password');
					res.body.should.not.have.property('salt');

					done();
				});
		});
	});

	describe('Testing the POST method', function() {
		it('Should be able to create new user', function(done){
			var newUser = {
				"firstName": "First",
				"lastName": "Last",
				"email": "user@example.com",
				"username": "newUser",
				"password": "password",
				"role": "User"
			};
			request(app).post(restApiUserPath)
					.set('Accept', 'application/json')
					.set('x-access-token', adminToken)
					.send(newUser)
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function(err, res) {
						res.body.should.be.instanceof(Object);
						res.body.should.have.property('success', true);
						res.body.should.have.property('user');
						res.body.user.should.have.property('firstName', newUser.firstName);
						res.body.user.should.have.property('lastName', newUser.lastName);
						res.body.user.should.have.property('fullName');
						res.body.user.should.have.property('email', newUser.email);
						res.body.user.should.have.property('username', newUser.username);
						res.body.user.should.have.property('role', newUser.role);
						res.body.user.should.not.have.property('password');
						res.body.user.should.not.have.property('salt');
						done();
					});
		});
	});

	describe('Testing the PUT method', function() {
		it('Should be able to modify user', function(done){
			var modifiedUser = {
				"firstName": "modifiedUserFirst",
				"lastName": "modifiedUserLast",
				"email": "modifiedUser@example.com",
				"username": "modifiedUser",
				"password": "password",
				"role": "User"
			};
			request(app).put(restApiUserPath + user.id)
					.set('Accept', 'application/json')
					.set('x-access-token', userToken)
					.send(modifiedUser)
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function(err, res) {
						res.body.should.be.instanceof(Object);
						res.body.should.have.property('success', true);
						done();
					});
		});
	});

	describe('Testing the DELETE method', function() {
		it('Should be able to delete user', function(done){
			request(app).delete(restApiUserPath + user.id)
					.set('Accept', 'application/json')
					.set('x-access-token', userToken)
					.expect('Content-Type', /json/)
					.expect(200)
					.end(function(err, res) {
						res.body.should.be.instanceof(Object);
						res.body.should.have.property('success', true);
						res.body.should.have.property('user');
						res.body.user.should.have.property('firstName', user.firstName);
						res.body.user.should.have.property('lastName', user.lastName);
						res.body.user.should.have.property('fullName');
						res.body.user.should.have.property('email', user.email);
						res.body.user.should.have.property('username', user.username);
						res.body.user.should.have.property('role', user.role);
						done();
					});
		});
	});

	afterEach(function(done) {
		User.remove().exec();
		done();
	});
});
