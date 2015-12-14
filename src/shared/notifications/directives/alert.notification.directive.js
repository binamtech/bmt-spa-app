'use strict';

angular.module('main').directive('bmtAlertNotification',
	function() {
		return {
			restrict: 'E',
			templateUrl: "shared/notifications/templates/alert.notification.template.html",
			replace: true,
		};
	});