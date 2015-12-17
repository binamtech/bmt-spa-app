'use strict';

var usersModule = angular.module('users');

usersModule.factory('AuthenticationFactory', [
	function () {
		return {
			isLogged: false,
			isLogout: false
		};
	}
]);

usersModule.factory('UserAuthFactory', ['$window', '$state', '$http', '$q', 'AuthenticationFactory', 'userConfig',
	'$injector',
	function ($window, $state, $http, $q, AuthenticationFactory, userConfig, $injector) {

		/**
		 * @private method
		 * @param {Object} user  - Account profile
		 * @description
		 * Save account profile to storage that app can access to it after refreshing page
		 * without request to server
		 */
		function _saveRegistration(user) {
			AuthenticationFactory.isLogged = true;
			AuthenticationFactory.isLogout = false;
			AuthenticationFactory.user = user;
			$window.localStorage.user = JSON.stringify(user);
		}

		/**
		 * @private method
		 * @description
		 * Clear all saved registration information
		 */
		function _removeRegistration() {
			AuthenticationFactory.isLogged = false;
			delete AuthenticationFactory.user;
			delete $window.localStorage.user;
		}

		//tracking authentication on other pages
		angular.element($window).on('storage', function(event) {
			if (event.key === 'user') {
				var userValue = event.newValue;
				if (userValue) {
					//login made from other page
					var user = JSON.parse(userValue);
					AuthenticationFactory.isLogged = true;
					AuthenticationFactory.isLogout = false;
					AuthenticationFactory.user = user;
				} else {
					//logout made from other page
					AuthenticationFactory.isLogged = false;
					AuthenticationFactory.isLogout = true;
					delete AuthenticationFactory.user;
				}
			}
		});

		return {
			signup: function (user) {
				var deferred = $q.defer();
				$http.post(userConfig.signupPath, user)
					.then(
						function (response) {
							var data = response.data;
							if (data && data.success) {
								deferred.resolve(data);
							} else {
								deferred.reject(data);
							}
						},
						function (response) {
							deferred.reject(response.data);
						});
				return deferred.promise;
			},
			login: function (username, password, rememberme) {
				var deferred = $q.defer();
				$http.post(userConfig.signinPath, {
					username: username,
					password: password,
					rememberme: rememberme
				}).then(
					function (response) {
						/*data – {string|Object} – The response body transformed with the transform functions.
						 status – {number} – HTTP status code of the response.
						 headers – {function([headerName])} – Header getter function.
						 config – {Object} – The configuration object that was used to generate the request.
						 statusText – {string} – HTTP status text of the response.*/
						var data = response.data;

						if (data && data.success) {
							_saveRegistration(data.user);
							deferred.resolve(data);
						} else {
							console.error(data);
							deferred.reject(data);
						}
					},
					function (response) {
						deferred.reject(response.data);
					});
				return deferred.promise;
			},
			/**
			 * @public method
			 * @description
			 * Request account profile from server in case of "Remember me" flag was checked
			 * on login process. JWS token is stored in cookies with httpOnly flag.
			 * So only server can access it
			 * @returns {Deferred} Returns a new instance of deferred.
			 */
			requestRegistration: function () {
				if (AuthenticationFactory.isLogout) {
					//logout function was called
					return $q.reject('Login is required!');
				} else
				if (!AuthenticationFactory.isLogged) {
					var deferred = $q.defer();
					$http.get(userConfig.profilePath).then(
						function (response) {
							var data = response.data;
							if (data) {
								_saveRegistration(data);
								deferred.resolve(data);
							}
						},
						function (response) {
							_removeRegistration();
							deferred.reject(response.data);
						});
					return deferred.promise;
				} else {
					return $q.when('Login is not required!');
				}
			},
			logout: function (err, info) {
				if (AuthenticationFactory.isLogged) {
					var username = AuthenticationFactory.user.username;
					$http.get(userConfig.signoutPath); //clear token in cookies via server
					_removeRegistration();
					AuthenticationFactory.isLogout = true;
					$state.go("login", {username: username, errorMessage: err, infoMessage: info});
				}
			},
			/**
			 * @public method
			 * @param {string} errorMessage
			 * @description
			 * Show dialog to request a password in case of token expiration to issue new one
			 * @returns {Deferred} Returns a new instance of deferred.
			 */
			requestPassword: function (errorMessage) {
				var $modal = $injector.get('$uibModal');
				var message = errorMessage || 'Session is expired! Input a password.';
				var modal = $modal.open({
					template: '<div class="modal-body">' +
					'   <div class="alert alert-danger">' + message +
					'   </div>' +
					'   <div class="form-group">' +
					'       <input type="password" class="form-control" placeholder="Password" ng-model="requestPassword" required>' +
					'   </div>' +
					'   <div class="form-group">' +
					'       <button ng-click="submit(requestPassword)" class="btn btn-primary">Submit</button>' +
					'   </div>' +
					'</div>',
					controller: function ($scope, $uibModalInstance) {
						$scope.submit = function (password) {
							$uibModalInstance.close(password);
						};
					}
				});
				/* modal.result is a promise that gets resolved when
				 * $modalInstance.close() is called */
				return modal.result.then(
					function (password) {
						var AuthenticationFactory = $injector.get('AuthenticationFactory');
						var UserAuthFactory = $injector.get('UserAuthFactory');
						return UserAuthFactory.login(AuthenticationFactory.user.username, password);
					},
					function () {
						//dialog was dismissed
						return $q.reject({message: message});
					});
			}
		};
	}
]);

usersModule.factory('TokenInterceptor', ['$q', '$window', '$injector',
	function ($q, $window, $injector) {
		var me = this;
		me.deferredRequest = null;

		return {
			//moved token to cookie storage
			/*request: function (config) {
				config.headers = config.headers || {};
				if ($window.sessionStorage.token) {
					config.headers['X-Access-Token'] = $window.sessionStorage.token;
					config.headers['Content-Type'] = "application/json";
				}
				return config || $q.when(config);
			},*/
			response: function (response) {
				return response || $q.when(response);
			},
			responseError: function (response) {
				//token is expired, error status = 419
				if ((/*response.status === 401 || */response.status === 419) && !me.deferredRequest) {
					var UserAuthFactory = $injector.get('UserAuthFactory');
					var $http = $injector.get('$http');
					var deferred = $q.defer();

					//remember request before token error
					me.deferredRequest = response.config;

					UserAuthFactory.requestPassword().then(
						deferred.resolve,
						function (err) {
							var data = err || {message: 'Error refreshing token expiration!'};
							UserAuthFactory.logout(data.message);
						});

					// When the session recovered, make the same backend call again and chain the request
					return deferred.promise.then(function () {
						me.deferredRequest = null;
						return $http(response.config);
					});
				}
				me.deferredRequest = null;
				return $q.reject(response);
			}
		};
	}
]);