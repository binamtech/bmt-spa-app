'use strict';

var gulp = require('gulp');

var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var iife = require("gulp-iife");
var imagemin = require('gulp-imagemin');

var bases = {
	app: 'src/',
	dist: 'public/'
};

var paths = {
	scripts: ['application.js', '**/*.js', '!lib/**/*.js', '!**/*.tests.js'],
	libs: ['lib/angular/angular.min.js',
		'lib/angular-i18n/*.js',
		'lib/angular-smart-table/dist/smart-table.min.js',
		'lib/angular-ui-router/release/angular-ui-router.min.js',
		'lib/angular-resource/angular-resource.min.js',
		'lib/angular-cookies/angular-cookies.min.js',
		'lib/angular-bootstrap/ui-bootstrap.min.js',
		'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
		'lib/angular-translate/angular-translate.min.js',
		'lib/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
		'lib/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
		'lib/angular-translate-storage-local/angular-translate-storage-local.min.js',
		'lib/angular-translate-handler-log/angular-translate-handler-log.min.js',
		'lib/angular-dynamic-locale/dist/tmhDynamicLocale.min.js',
		'lib/bootstrap/dist/css/bootstrap.min.css',
		'lib/bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
		'lib/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2',
		'lib/bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
		'lib/font-awesome/css/font-awesome.min.css',
		'lib/font-awesome/fonts/*.woff2'],
	styles: ['css/**/*.css'],
	html: ['**/*.html', '!lib/**/*.html'],
	resources: ['resources/**/*.*'],
	//html: ['index.html', '404.html'],
	images: ['image/**/*.png']
	//extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
};

// Delete the dist directory
gulp.task('clean', function() {
	return gulp.src(bases.dist)
			.pipe(clean());
});

// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function() {
	gulp.src(paths.scripts, {cwd: bases.app})
			.pipe(jshint())
			.pipe(jshint.reporter('default'))
			.pipe(sourcemaps.init())            //for debugging in browser
			.pipe(iife({ useStrict: false }))
			.pipe(concat('app.min.js'))
			.pipe(ngAnnotate())
			.pipe(uglify())
			.pipe(sourcemaps.write())           //for debugging in browser
			.pipe(gulp.dest(bases.dist));
});

// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function() {
	gulp.src(paths.images, {cwd: bases.app})
			.pipe(imagemin())
			.pipe(gulp.dest(bases.dist + 'image/'));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
	// Copy html
	gulp.src(paths.html, {cwd: bases.app})
			.pipe(gulp.dest(bases.dist));

	// Copy styles
	gulp.src(paths.styles, {cwd: bases.app})
			.pipe(gulp.dest(bases.dist + 'css'));

	// Copy resources
	gulp.src(paths.resources, {cwd: bases.app})
		.pipe(gulp.dest(bases.dist + 'resources'));

	// Copy lib scripts, maintaining the original directory structure
	gulp.src(paths.libs, {cwd: bases.app + '**'})
			.pipe(gulp.dest(bases.dist));

	// Copy extra html5bp files
/*	gulp.src(paths.extras, {cwd: bases.app})
			.pipe(gulp.dest(bases.dist));*/
});

// A development task to run anytime a file changes
gulp.task('watch', function() {
	gulp.watch('src/**/*', ['scripts', 'copy']);
});

// Define the default task as a sequence of the above tasks
gulp.task('default', ['clean', 'scripts', 'imagemin', 'copy']);