'use strict';

angular.module('users', ['ui.router', 'smart-table']);

angular.module('users').constant('userConfig', {
	apiPath: 'api/v1/users',
	signinPath: 'api/v1/authenticate',
	signupPath: 'api/v1/signup',
	signoutPath: 'api/v1/signout',
	profilePath: 'api/v1/profile'
});

angular.module('users').constant('userNotifyMessages', {
	authError: 'MSG_USER_AUTH_ERROR',
	signupError: 'MSG_USER_SIGNUP_ERROR',
	serverError: 'MSG_SERVER_ERROR',
	invalidCredentials: 'MSG_USER_INVALID_CREDENTIAL',
	profileSuccess: 'MSG_PROFILE_UPDATE_SUCCESS'
});

angular.module('users').config(['$stateProvider',
	function ($stateProvider) {
		$stateProvider
			.state('settings', {
				url: '/settings',
				abstract: true,
				templateUrl: 'shared/navbar/views/side-nav.view.html',
				onEnter: function(bmtSideNavService){
					bmtSideNavService.sideMenuEnable();
				},
				onExit: function(bmtSideNavService){
					bmtSideNavService.sideMenuDisable();
				},
				controller: 'UsersCtrl',
				access: {
					requiredLogin: true
				}
			})
			.state('settings.menu', {
				url: '/:menuItem',
				templateUrl: function ($stateParams){
					return 'users/views/'+ $stateParams.menuItem +'.client.view.html';
				},
				 access: {
				    requiredLogin: true
				 }
			});
	}
]);