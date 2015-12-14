'use strict';

angular.module('main').directive('bmtSideNavMenu', ['bmtSideNavService',
	function(bmtSideNavService) {
	return {
		restrict: 'E',
		templateUrl: "shared/navbar/templates/side-nav.template.html",
		replace: true,
		scope: {
			menu: '=',
			menuClick: '&'
		},
		link: function (scope) { //scope, element, attrs, ctrl, transcludeFn

			scope.menuItemClick = function($event, menuItem){

				if (!menuItem) {
					return;
				}

				//revert isCollapsed for group menu item
				if (menuItem.items && !menuItem.disableCollapse) {
					menuItem.isCollapsed = !menuItem.isCollapsed;
				}

				//hide side menu in toggled state for mobile screen mode
				if ((menuItem.state && menuItem.state !== '#') || menuItem.action) {
					bmtSideNavService.sideMenuToggled();
				}

				//transition menu item click to up controller
				if (menuItem.action) {
					scope.menuClick({menuItem: menuItem});
				}

				if (!menuItem.state || menuItem.state === '#') {
					$event.preventDefault();
				}
			};
		}
	};
}]);

angular.module('main').directive('bmtToggleOff', ['bmtSideNavService', function(bmtSideNavService) {
	return {
		restrict: 'A',
		link: function (scope, element) {
			element.on('click', function() {
				bmtSideNavService.sideMenuToggleOff();
			});
		}
	};
}]);
