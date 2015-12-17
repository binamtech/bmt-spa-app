'use strict';

var usersModule = angular.module('users');

usersModule.controller('AuthenticationCtrl', ['$scope', '$state', 'UserAuthFactory', 'userNotifyMessages',
	'$stateParams',
	function($scope, $state, UserAuthFactory, userNotifyMessages, $stateParams) {

		$scope.user = $scope.user || {};

		//$stateParams {username: text, errorMessage: text, infoMessage: text}
		if ($stateParams.errorMessage && (typeof $stateParams.errorMessage === 'string')) {
			$scope.alertError = $stateParams.errorMessage;
		}
		if ($stateParams.username && (typeof $stateParams.username === 'string')) {
			$scope.user.username = $stateParams.username;
		}

		$scope.login = function(username, password, rememberme) {
			if (username !== undefined && password !== undefined) {
				UserAuthFactory.login(username, password, rememberme).then(
						function () {
							var redirectState = $stateParams.redirectState;
							if (redirectState && redirectState.toState && redirectState.toState.name !== 'login') {
								$state.go(redirectState.toState,redirectState.toParams);
							} else {
								$state.go('home');
							}
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
