/* jshint node: true */
module.exports = function(grunt) {

    grunt.initConfig({

        npmPackage: grunt.file.readJSON('package.json'),
        bowerPackage: grunt.file.readJSON('bower.json'),

        uglify: {
            min: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/*.js',
                    dest: 'dist',
                    ext: '.min.js'
                }],
                options: {

                }
            }
        },

        copy: {
            jsFiles: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*.js'],
                    dest: 'dist'
                }]
            }
        },

        jshint: {
            options: {
                'jshintrc': '.jshintrc'
            },
            all: ['src', 'Gruntfile.js', 'test/**/*.js']
        },

        jscs: {
            options: {
                config: '.jscsrc'
            },
            scripts: {
                files: {
                    src: ['src/**/*.js', 'test/**/*.js', 'Gruntfile.js']
                }
            }
        },

        watch: {
            jsFiles: {
                expand: true,
                files: ['src/**/*.js', 'Gruntfile.js'],
                tasks: ['jshint', 'jscs', 'copy', 'uglify'],
                options: {
                    spawn: false
                }
            },
            testFiles: {
                expand: true,
                files: ['test/**/*.js'],
                tasks: ['jshint', 'jscs'],
                options: {
                    spawn: false
                }
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commitFiles: ['package.json', 'bower.json'],
                tagName: '%VERSION%',
                push: false
            }
        }

    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['jshint', 'jscs', 'uglify', 'copy']);

};
