module.exports = function(grunt) {

  grunt.initConfig({
    compass: {
      dist: {
        options: {
          config: 'config.rb',
          cssDir: 'css',
          environment: 'production'
        }
      }
    },
    includereplace: {
      dist: {
        options: {
          prefix: '@@',
          suffix: ''
        },
        src: 'layouts/*.html',
        dest: '.'
      }
    },
    watch: {
      css: {
        files: ['scss/*.scss', 'blocks/*.html', 'layouts/*.html'],
        tasks: ['compass','clean:css', 'includereplace']
      },
    },
    clean: {
      css: ["css/_*.css"],
    },
    connect : {
      server : {
        options: {
          port: 8080,
          keepalive : true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-include-replace');

  grunt.registerTask( 'default', ['connect']);
};