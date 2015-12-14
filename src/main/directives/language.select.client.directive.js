/**
 * @ngdoc function
 * @name main.directive:bmtLangMenuItem
 * @description
 * # bmtLangMenuItem
 * Directive to append language select and set its view and behavior as a menu item
 */
'use strict';

angular.module('main').directive('bmtLangMenuItem', ['LocaleService', function (LocaleService) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: "main/templates/language.select.client.template.html",
		link: function (scope) {
			scope.locales = LocaleService.getLocales();

			if (scope.locales) {
				scope.activeLocale = scope.locales[LocaleService.getActiveLocal()];
			}

			scope.visible = scope.activeLocale && scope.locales && Object.keys(scope.locales).length > 1;

			scope.changeLanguage = function (locale) {
				LocaleService.setLocale(locale).then(function(data) {
					scope.activeLocale = scope.locales[data];
				});
			};
		}
	};
}]);

