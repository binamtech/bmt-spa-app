'use strict';

var usersModule = angular.module('users');

usersModule.controller('AuthenticationCtrl', ['$scope', '$state', 'UserAuthFactory', 'userNotifyMessages',
	'$stateParams',
	function($scope, $state, UserAuthFactory, userNotifyMessages, $stateParams) {

		//$stateParams {username: text, errorMessage: text, infoMessage: text}
		if ($stateParams.errorMessage && (typeof $stateParams.errorMessage === 'string')) {
			$scope.authenticationError = $stateParams.errorMessage;
		}
		if ($stateParams.username && (typeof $stateParams.username === 'string')) {
			$scope.user = {username:$stateParams.username};
		}

		$scope.login = function(username, password) {
			if (username !== undefined && password !== undefined) {
				UserAuthFactory.login(username, password).then(
						function () {
							$state.go('home');
						}, function (err) {
							var data = err || {};
							$scope.alertError = data.message || userNotifyMessages.serverError;
						});
			} else {
				$scope.alertError = userNotifyMessages.invalidCredentials;
			}
		};

		$scope.logout = function () {
			UserAuthFactory.logout();
		};
	}
]);
