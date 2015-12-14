'use strict';

angular.module('main').factory('bmtSideNavService', ['$rootScope', function($rootScope) {

	var self = {
		sideMenuEnable: function(){
			$rootScope.sideMenuActive = true;

		},
		sideMenuDisable: function(){
			$rootScope.sideMenuActive = false;
			$rootScope.sideMenuToggled = false;
		},
		sideMenuToggled: function(){
			$rootScope.sideMenuToggled = !$rootScope.sideMenuToggled;
		},
		sideMenuToggleOff: function(){
			if ($rootScope.sideMenuToggled) {
				$rootScope.sideMenuToggled = false;
				$rootScope.$digest();
			}
		}
	};

	return self;
}]);