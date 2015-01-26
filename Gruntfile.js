module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-version');
    
    grunt.registerTask('default', ['sass', 'cssmin', 'concat', 'uglify']);

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
            }  
        },

        watch: {
            css: {
                files: 'boldviewer.scss',
                tasks: ['sass', 'cssmin', 'version::prerelease']
            },
            js: {
                files: 'jquery.boldviewer.js',
                tasks: ['uglify', 'version::prerelease']
            }
        }

    });

}
