'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		env: {
			dev: {
				NODE_ENV: 'development'
			},
			test: {
				NODE_ENV: 'test'
			}
		},
		express: {
			dev: {
				options: {
					script: 'server.js'
				}
			},
			test: {
				options: {
					script: 'server.js'
				}
			}
		},
		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					ext: 'js,html',
					watch: ['server.js', 'config/**/*.js', 'app/**/*.js']
				}
			}
		},
		mochaTest: {
			src: 'app/tests/**/*.js',
			options: {
				reporter: 'spec'
			}
		},
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		},
		protractor: {
			e2e: {
				options: {
					configFile: 'protractor.grunt.conf.js'
				}
			}
		},
		jshint: {
			all: {
				src: ['server.js', 'config/**/*.js', 'app/**/*.js', 'src/*.js', 'src/main/**/*.js',
					'src/resources/**/*.json', 'src/shared/**/*.js', 'src/users/**/*.js']
			},
			options: {
				jshintrc: '.jshintrc' // relative to Gruntfile
			}
		},
		csslint: {
			all: {
				src: 'src/css/**/*.css'
			}
		},
		watch: {
			js: {
				files: ['server.js', 'config/**/*.js', 'app/**/*.js', 'src/js/*.js', 'src/modules/**/*.js'],
				tasks: ['jshint']
			},
			css: {
				files: 'public/modules/**/*.css',
				tasks: ['csslint']
			}
		},
		concurrent: {
			dev: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-protractor-runner');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-express-server');

	//grunt.registerTask('server', ['env:dev', 'express:dev']);
	//grunt.registerTask('stop-server', ['env:dev', 'express:dev:stop']);

	grunt.registerTask('default', ['env:dev', 'lint', 'concurrent']);
	grunt.registerTask('test-protractor', ['env:test', 'express:test', 'protractor']);
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma', 'protractor']);
	grunt.registerTask('lint', ['jshint', 'csslint']);
};