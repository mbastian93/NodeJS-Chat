/**
 * Created by Marcel on 05.04.2015.
 */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            scripts: {
                files: ['public/scripts/*.js'],
                tasks: ['uglify'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['public/styles/*.css'],
                tasks: ['cssmin'],
                options: {
                    spawn: false
                }
            }
        },
        uglify: {
            build: {
                src : ["public/scripts/*.js", "!*.min.js"],
                dest : "public/scripts/*.min.js"
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'public/styles',
                    src: ['*.css', "!*.min.css"],
                    dest: 'public/styles',
                    ext: '.min.css'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['watch']);

};