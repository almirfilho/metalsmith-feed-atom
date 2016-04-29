const expect = require('chai').expect;
const metalsmith = require('metalsmith');
const collections = require('metalsmith-collections');
const readxml = require('xml2js').parseString;
const feed = require('../src/feed');


describe('Initialization', () => {
  var metal;

  before(() => {
    metal = metalsmith('test/fixtures');
  });

  it('should be a function', () => {
    expect(feed).to.be.a.function;
  });

  it('should return a function', () => {
    expect(feed({ collection: 'something' })).to.be.a.function;
  });

  it('should require collection name', () => {
    expect(feed).to.throw(Error);
  });

  it('should require collections to be configured', () => {
    metal._metadata = {};
    var call = feed({ collection: 'name' }).bind(null, [], metal, () => {});
    expect(call).to.throw(Error);
  });

  it('should throw error if collection doesnt exist', () => {
    metal._metadata.collections = {};
    var call = feed({ collection: 'posts' }).bind(null, [], metal, () => {});
    expect(call).to.throw(Error);
  });

  it('should not throw error if collection exist', () => {
    metal._metadata.collections = { articles: {} };
    var call = feed({ collection: 'articles' }).bind(null, [], metal, () => {});
    expect(call).not.to.throw(Error);
  });
});

describe('Generation', () => {
  var metalfeed = feedoptions => (
    metalsmith('test')
      .source('fixtures')
      .use(collections({ articles: '*.html' }))
      .use(feed(feedoptions))
  );

  it('should generate file in default destination', done => {
    metalfeed({ collection: 'articles' }).build((err, files) => {
      expect(files).to.contain.keys('index.xml');
      done();
    });
  });

  it('should generate file in custom destination', done => {
    metalfeed({ collection: 'articles', destination: 'other.xml' })
      .build((err, files) => {
        expect(files).to.contain.keys('other.xml');
        done();
      });
  });

  it('should have content', done => {
    metalfeed({ collection: 'articles' }).build((err, files) => {
      expect(files['index.xml']).to.have.property('contents');
      expect(files['index.xml'].contents).to.be.not.empty;
      done();
    });
  });

  it('should have xml content', done => {
    metalfeed({ collection: 'articles' }).build((err, files) => {
      var content = files['index.xml'].contents.toString().toLowerCase();
      expect(content).to.include('<?xml version="1.0"', 'encoding="utf-8"');
      done();
    });
  });

  it('should have atom elements', done => {
    metalfeed({ collection: 'articles' }).build((err, files) => {
      readxml(files['index.xml'].contents.toString(), (err, result) => {
        expect(result).to.deep.equal({
          feed: {
            '$': { xmlns: 'http://www.w3.org/2005/Atom' },
            id: [''],
            title: [''],
            updated: [''],
            link: [
              {'$': { href: '', rel: 'self' }},
              {'$': { href: '' }}
            ]
          }
        });
        done();
      });
    });
  });
});
