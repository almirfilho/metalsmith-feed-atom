module.exports = grunt => {
  grunt.config('mochaTest', {
    test: {
      src: 'test/**/*.test.js'
    }
  });
};
