module.exports = grunt => {
  grunt.config('watch', {
    src: {
      files: ['src/*.js', 'test/fixtures/**/*.html', 'test/**/*.js'],
      tasks: ['test']
    }
  });
};
