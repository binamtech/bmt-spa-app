'use strict';

var usersModule = angular.module('users');

usersModule.factory('Users', ['$resource', 'userConfig',
	function($resource, userConfig) {
		return $resource(userConfig.apiPath + '/:id', {
			id: '@id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}]);