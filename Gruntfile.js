module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-string-replace');
    
    grunt.registerTask('default', ['githooks', 'sass', 'cssmin', 'uglify']);
    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: [{
                    'css/boldviewer.css': ['scss/boldviewer.scss']
                }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    'css/boldviewer.min.css': ['css/boldviewer.css']
                }]
            }
        },

        uglify: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'js/jquery.boldviewer.min.js': 'js/jquery.boldviewer.js',
                }
            }
        },
        
        version: {
            sources: {
                options: {
                    prefix: '@version\\s*'
                },
                src: ['js/jquery.boldviewer.js', 'scss/boldviewer.scss']
            },
            project: {
                src: ['package.json', 'bower.json']
            },
        },
        watch: {
            css: {
                files: 'bv.scss',
                tasks: ['sass', 'cssmin']
            },
            js: {
                files: 'jquery.bv.js',
                tasks: ['uglify']
            }
        },
        gitadd: {
            bv: {
                files: {
                    src: ['package.json', 'js/jquery.boldviewer.js', 'js/jquery.boldviewer.min.js', 'scss/boldviewer.scss', 'css/boldviewer.css', 'css/boldviewer.min.css']
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
