const expect = require('chai').expect;
const feed = require('../src/feed');


describe('Atom feed generator plugin', () => {
  it('should be a function', () => {
    expect(feed).to.be.a.function;
  });

  it('should return a function', () => {
    expect(feed()).to.be.a.function;
  })
});
