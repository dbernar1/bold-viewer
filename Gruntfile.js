module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-git');
    
    grunt.registerTask('default', ['githooks', 'sass', 'cssmin', 'uglify']);
    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: [{
                    'boldviewer.css': ['boldviewer.scss']
                }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    'boldviewer.min.css': ['boldviewer.css']
                }]
            }
        },

        uglify: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'jquery.boldviewer.min.js': 'jquery.boldviewer.js',
                }
            }
        },
        
        version: {
            project: {
                src: ['package.json']
            },
            sources: {
                options: {
                    prefix: '@version\\s*'
                },
                src: ['jquery.boldviewer.js', 'boldviewer.scss']
            }
        },

        watch: {
            css: {
                files: 'boldviewer.scss',
                tasks: ['sass', 'cssmin']
            },
            js: {
                files: 'jquery.boldviewer.js',
                tasks: ['uglify']
            }
        },
        
        gitadd: {
            boldviewer: {
                files: {
                    src: ['package.json', 'jquery.boldviewer.js', 'jquery.boldviewer.min.js', 'boldviewer.scss', 'boldviewer.css', 'boldviewer.min.css']
                }
            }
        },
        
        githooks: {
            all: {
                'pre-commit': 'version::prerelease sass cssmin uglify gitadd'
            }
        }

    });

}
