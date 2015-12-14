'use strict';

describe('Testing Authentication Controller', function () {
	var _scope, _window, _AuthenticationFactory, AuthenticationCtrl, _state;
	beforeEach(function () {
		module('users');
		//use mock state
		module('stateMock');

		jasmine.addMatchers({
			//toEqualData: function (util, customEqualityTesters) {
			toEqualData: function () {
				return {
					compare: function (actual, expected) {
						return {
							pass: angular.equals(actual, expected)
						};
					}
				};
			}
		});

		inject(function ($rootScope, $controller, $state, $window, AuthenticationFactory) {
			_scope = $rootScope.$new();
			_state = $state;
			_window = $window;
			_AuthenticationFactory = AuthenticationFactory;
			AuthenticationCtrl = $controller('AuthenticationCtrl', {
				$scope: _scope
			});
		});
	});

	it('Should be registered', function () {
		expect(AuthenticationCtrl).toBeDefined();
	});
	it('Should include login/logout methods', function () {
		expect(_scope.login).toBeDefined();
		expect(_scope.logout).toBeDefined();
	});
	it('Should have an user json stringified and token strings in sessionStorage after authentication',
		inject(function ($httpBackend, userConfig) {
			var res = {
				success: true,
				user: {
					username:"username"
				},
				token: "token"
			};

			//expect going to home after successful login
			_state.expectTransitionTo("home");

			$httpBackend.expectPOST(userConfig.authPath).respond(res);
			_scope.login('username','password');
			$httpBackend.flush();

			/*toEqual, toBe, toBeTruthy, toBeFalsy
			toBe for negation*/

			expect(_AuthenticationFactory.isLogged).toBeTruthy();
			expect(_AuthenticationFactory.user).toEqualData(res.user);

			expect(_window.sessionStorage.token).toEqual(res.token);
			expect(_window.sessionStorage.user).toEqual(JSON.stringify(res.user));
		}));
});
