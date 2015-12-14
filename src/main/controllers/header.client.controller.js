'use strict';

angular.module('main').controller("HeaderCtrl", ['$scope', 'UserAuthFactory', 'AuthenticationFactory',
		'bmtSideNavService',
	function($scope, UserAuthFactory, AuthenticationFactory, bmtSideNavService) {

		$scope.navCollapsed = true;

		$scope.navbarToggleClick = function() {
			$scope.navCollapsed = !$scope.navCollapsed;
		};

		$scope.sidebarToggleClick = function() {
			bmtSideNavService.sideMenuToggled();
		};

		$scope.close = function () {
			$scope.navCollapsed = true;
		};

		$scope.logout = function () {
			$scope.navCollapsed = true;
			UserAuthFactory.logout();
		};

		$scope.isLogged = function () {
			return AuthenticationFactory.isLogged;
		};
	}
]);