'use strict';

module.exports = function(config) {
	config.set({
		frameworks: ['jasmine'],
		//plugins : ['karma-jasmine', 'karma-phantomjs-launcher'],
		files: [
			'src/lib/angular/angular.js',
			//'src/lib/angular-i18n/*.js',
			'src/lib/angular-smart-table/dist/smart-table.js',
			'src/lib/angular-ui-router/release/angular-ui-router.js',
			'src/lib/angular-cookies/angular-cookies.min.js',
			'src/lib/angular-resource/angular-resource.js',
			'src/lib/angular-bootstrap/ui-bootstrap.js',
			'src/lib/angular-bootstrap/ui-bootstrap-tpls.js',
			'src/lib/angular-translate/angular-translate.js',
			'src/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
			'src/lib/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
			'src/lib/angular-translate-storage-local/angular-translate-storage-local.js',
			'src/lib/angular-translate-handler-log/angular-translate-handler-log.js',
			'src/lib/angular-dynamic-locale/dist/tmhDynamicLocale.js',
			'src/lib/angular-mocks/angular-mocks.js',
			'src/application.js',
			'src/*[!lib]*/*.js',
			'src/*[!lib]*/*[!tests]*/*.js',
			'src/*[!lib]*/tests/unit/**/*.js'
		],
		reporters: ['progress'],
		browsers: ['PhantomJS'],
		captureTimeout: 60000,
		singleRun: true
	});
};