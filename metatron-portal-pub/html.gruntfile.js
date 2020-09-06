module.exports = function (grunt) {
	var spriteConfig = require('./html.sprite.config.js');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					includePaths: [],
					sourceMap: true,
					sourceMapEmbed: true,
					outputStyle: 'compressed'
				},
				files: {
					'client/css/dtp.css': 'client/sass/style.scss'
				}
			}
		},
		sprite: {
			'dtp': spriteConfig('1x')
		},
		watch: {
			all: {
				files: [
					'client/sprite/**/*.png',
					'client/sass/**/*.scss'
				],
				tasks: ['sass', 'sprite']
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-spritesmith');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('dist', ['sprite', 'sass:dist']);
}
