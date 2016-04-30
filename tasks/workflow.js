module.exports = grunt => {
  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('dev', ['test', 'watch']);
};
