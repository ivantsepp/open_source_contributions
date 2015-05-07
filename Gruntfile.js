module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    copy: {
      main: {
        files: [
          {expand: true, src: ['bower_components/octicons/octicons/*'], dest: 'public/octicons', flatten: true},
        ]
      },
    },
    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/main.css': 'styles/main.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded'
        },
        files: {
          'public/main.css': 'styles/main.scss'
        }
      }
    },
    watch: {
      css: {
        files: 'styles/*.scss',
        tasks: ['sass:dev']
      },
      js: {
        files: ['js/components/**/*.js', 'js/main.js'],
        tasks: ['browserify', 'concat', 'uglify']
      }
    },
    browserify: {
      dist: {
        src: ['js/main.js'],
        dest: 'js/build.js',
        options: {
          transform: ['reactify']
        }
      }
    },
    concat: {
      dist: {
        src: ['js/build.js'],
        dest: 'public/main.js',
      },
    },
    uglify: {
        my_target: {
          files: {
            'public/main.min.js': ['public/main.js']
          }
        }
      }
  });

  grunt.registerTask('default', ['copy', 'watch']);
  grunt.registerTask('deploy', ['sass:dist', 'copy', 'browserify', 'concat', 'uglify']);
};
