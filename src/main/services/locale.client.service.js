/**
 * @ngdoc function
 * @name main.service:LocaleService
 * @description
 * # LocaleService
 * Service for setting/getting current locale
 */
'use strict';

angular.module('main')
	.service('LocaleService', function ($translate, LOCALES, $rootScope, tmhDynamicLocale) {

		var localesObj = LOCALES.locales;

		var checkLocaleIsValid = function (locale) {
			return localesObj.hasOwnProperty(locale);
		};

		/**
		 * Stop application loading animation when translations are loaded
		 */
		var $html = angular.element(document).find('html');
		var LOADING_CLASS = 'app-loading';

		function startLoadingAnimation() {
			$html.addClass(LOADING_CLASS);
		}

		function stopLoadingAnimation() {
			$html.removeClass(LOADING_CLASS);
		}

		// EVENTS
		$rootScope.$on('$translateChangeSuccess', function (event, data) {
			document.documentElement.setAttribute('lang', data.language);// sets "lang" attribute to html

			tmhDynamicLocale.set(data.language.toLowerCase().replace(/_/g, '-'));// load Angular locale
		});

		$rootScope.$on('$localeChangeSuccess', function () {
			stopLoadingAnimation();
		});

		return {
			getActiveLocal: function () {
				return $translate.use();
			},
			setLocale: function (locale) {
				if (!checkLocaleIsValid(locale)) {
					throw new Error('Locale name "' + locale + '" is invalid');
				}
				startLoadingAnimation();
				return $translate.use(locale);
			},
			getLocales: function () {
				return localesObj;
			}
		};
	});
