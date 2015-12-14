'use strict';

var usersModule = angular.module('users');

usersModule.factory('AuthenticationFactory', ['$window',
	function ($window) {
		return {
			isLogged: false,
			check: function () {
				if ($window.sessionStorage.token && $window.sessionStorage.user) {
					this.isLogged = true;
				} else {
					this.isLogged = false;
					delete this.user;
				}
			}
		};
	}
]);

usersModule.factory('UserAuthFactory', ['$window', '$state', '$http', '$q', 'AuthenticationFactory', 'userConfig',
	'$injector',
	function ($window, $state, $http, $q, AuthenticationFactory, userConfig, $injector) {
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
			login: function (username, password) {
				var deferred = $q.defer();

				$http.post(userConfig.authPath, {
					username: username,
					password: password
				}).then(
					function (response) {
						/*data – {string|Object} – The response body transformed with the transform functions.
						 status – {number} – HTTP status code of the response.
						 headers – {function([headerName])} – Header getter function.
						 config – {Object} – The configuration object that was used to generate the request.
						 statusText – {string} – HTTP status text of the response.*/
						var data = response.data;

						if (data && data.success) {
							AuthenticationFactory.isLogged = true;
							AuthenticationFactory.user = data.user;

							$window.sessionStorage.token = data.token;
							$window.sessionStorage.user = JSON.stringify(data.user);

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
			logout: function (err, info) {
				if (AuthenticationFactory.isLogged) {
					AuthenticationFactory.isLogged = false;
					var username = AuthenticationFactory.user.username;
					delete AuthenticationFactory.user;

					delete $window.sessionStorage.token;
					delete $window.sessionStorage.user;

					$state.go("login", {username: username, errorMessage: err, infoMessage: info});
				}
			},
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
			request: function (config) {
				config.headers = config.headers || {};
				if ($window.sessionStorage.token) {
					config.headers['X-Access-Token'] = $window.sessionStorage.token;
					config.headers['Content-Type'] = "application/json";
				}
				return config || $q.when(config);
			},
			response: function (response) {
				return response || $q.when(response);
			},
			responseError: function (response) {
				if ((/*response.status === 401 || */response.status === 419) && !me.deferredRequest) {
					var UserAuthFactory = $injector.get('UserAuthFactory');
					var $http = $injector.get('$http');
					var deferred = $q.defer();

					//remember request before token error
					me.deferredRequest = response.config;

					UserAuthFactory.requestPassword().then(
						deferred.resolve,
						function (err) {
							var data = err || {};
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