module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');

  grunt.initConfig({
    jshint: {
      all: ['*.js', 'test/*.js'],

      options: {
        jshintrc: true
      }
    },
    qunit: {
      all: ['test/index.html', 'test/document_ready.html']
    }
  });

  grunt.registerTask('test', ['jshint', 'qunit']);
  grunt.registerTask('default', ['test']);
};