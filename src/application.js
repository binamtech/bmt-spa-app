'use strict';

var mainApplicationModuleName = 'main';

var mainApplicationModule = angular.module(mainApplicationModuleName,
	['ngResource', 'ngCookies', 'ui.router', 'users', 'ui.bootstrap', 'pascalprecht.translate', 'tmh.dynamicLocale']);

mainApplicationModule.constant('LOCALES', {
	'locales': {
		'ru_RU': 'RU',
		'en_US': 'EN'
	},
	'preferredLocale': 'en_US'
});

mainApplicationModule.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider',
	'$translateProvider', 'tmhDynamicLocaleProvider',
	function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, $translateProvider,
	          tmhDynamicLocaleProvider) {

		$locationProvider.hashPrefix('!');

		//translation config
		$translateProvider.useMissingTranslationHandlerLog();

		$translateProvider.useStaticFilesLoader({
			prefix: 'resources/locale-',
			suffix: '.json'
		});
		$translateProvider.preferredLanguage('en_US');
		$translateProvider.useLocalStorage();

		tmhDynamicLocaleProvider.localeLocationPattern('lib/angular-i18n/angular-locale_{{locale}}.js');

		//interceptors
		$httpProvider.interceptors.push('TokenInterceptor');

		//states
		$urlRouterProvider.otherwise('/');
		$stateProvider
				.state('home', {
					url: '/',
					access: {
						requiredLogin: true
					}
				})
				.state('login', {
					url: '/login',
					templateUrl: 'users/views/login.client.view.html',
					controller: 'AuthenticationCtrl',
					params: {
						username: null,
						errorMessage: null,
						infoMessage: null,
						redirectState: null
					},
					resolve: {
						checkLoginState: function($state, $stateParams, UserAuthFactory) {
							var redirectState = $stateParams.redirectState;
							return UserAuthFactory.requestRegistration().then(
								function () {
									if (redirectState && redirectState.toState) {
										$state.go(redirectState.toState, redirectState.toParams);
									} else {
										$state.go('home');
									}
								}).catch(
								function (err) {
									//show login page
									//console.log('show login page', err);
									return err;
								});
						}
					},
					access: {
						requiredLogin: false
					}
				})
				.state('signup', {
					url: '/signup',
					templateUrl: 'users/views/signup.client.view.html',
					controller: 'UsersCtrl',
					access: {
						requiredLogin: false
					}
				});
	}
]);

mainApplicationModule.run(['$rootScope', '$window', '$state', '$stateParams', 'AuthenticationFactory',
	function ($rootScope, $window, $state, $stateParams, AuthenticationFactory) {
		$rootScope.$state = $state;
		$rootScope.$stateParams = $stateParams;

		$rootScope.$on('$stateChangeStart',
				function (event, toState, toParams) {//event, toState, toParams, fromState, fromParams
					var stateRequiredLogin = toState.access && toState.access.requiredLogin &&
							!AuthenticationFactory.isLogged;
					if (stateRequiredLogin && toState.name !== 'login')  {
							event.preventDefault();
							//go to login page with next redirection
							var params = {redirectState: {toState: toState, toParams: toParams}};
							$state.go('login', params);
					} else {
						//go to home page if user is logged in
						if (AuthenticationFactory.isLogged && toState.name === 'login') {
							event.preventDefault();
							$state.go('home');
						}
					}
				});

		$rootScope.$on('$stateChangeSuccess', function () {//event, toState, toParams, fromState, fromParams
			$rootScope.showMenu = AuthenticationFactory.isLogged;
			$rootScope.role = AuthenticationFactory.user ? AuthenticationFactory.user.role : null;
		});
	}]);

/*if (window.location.hash === '#_=_') {
	window.location.hash = '#!';
}*/

angular.element(document).ready(function () {
	angular.bootstrap(document, [mainApplicationModuleName]);
});
