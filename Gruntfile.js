module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.initConfig({
    copy: {
      main: {
        files: [
          {expand: true, src: ['bower_components/octicons/octicons/*'], dest: 'public/octicons', flatten: true},
        ],
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
        files: '**/*.scss',
        tasks: ['sass:dev']
      }
    }
  });

  grunt.registerTask('default', ['copy', 'watch']);
  grunt.registerTask('deploy', ['sass:dist', 'copy']);
};
