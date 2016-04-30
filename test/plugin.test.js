const expect = require('chai').expect;
const metalsmith = require('metalsmith');
const collections = require('metalsmith-collections');
const readxml = require('xml2js').parseString;
const feed = require('../src/plugin');


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
    metal._metadata.collections = { articles: [] };
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

  it('should have basic atom elements', done => {
    const metadata = {
      title: 'Something',
      subtitle: 'Something else',
      url: 'http://something.com',
      updated: new Date().toISOString()
    };

    metalfeed({ collection: 'articles', metadata: metadata })
      .build((err, files) => {
        readxml(files['index.xml'].contents.toString(), (err, result) => {
          expect(result).to.have.property('feed');
          expect(result.feed).to.have.deep.property('$.xmlns', 'http://www.w3.org/2005/Atom');
          expect(result.feed).to.have.deep.property('id.0', metadata.url);
          expect(result.feed).to.have.deep.property('title.0', metadata.title);
          expect(result.feed).to.have.deep.property('subtitle.0', metadata.subtitle);
          expect(result.feed).to.have.deep.property('updated.0', metadata.updated);
          expect(result.feed).to.have.deep.property('link');
          expect(result.feed.link).to.deep.equal([
            {'$': { href: metadata.url }},
            {'$': { href: metadata.url+'/index.xml', rel: 'self' }}
          ]);
          done();
        });
      });
  });

  it('should have entry items', done => {
    var metadata = { url: 'http://something.com' };

    metalfeed({ collection: 'articles', metadata: metadata })
      .build((err, files) => {
        readxml(files['index.xml'].contents.toString(), (err, result) => {
          expect(result.feed).to.have.property('entry');
          expect(result.feed.entry).to.have.length(2);
          done();
        });
      });
  });

  it('should have atom entry elements', done => {
    var metadata = { url: 'http://something.com' };

    metalfeed({ collection: 'articles', metadata: metadata })
      .build((err, files) => {
        readxml(files['index.xml'].contents.toString(), (err, result) => {
          expect(result.feed.entry[0]).to.deep.equal({
            id: [metadata.url + '/article1.html'],
            title: ['Article 1'],
            updated: [new Date('2014-12-12').toISOString()],
            content: ['\nArticle 1 content.\n'],
            link: [{'$': { href: metadata.url + '/article1.html' }}],
            author: [{
              name: ['Some Guy'],
              uri: ['http://someguy.com'],
              email: ['some@guy.com']
            }]
          });
          done();
        });
      });
  });

  it('should escape html content in entries', done => {
    metalfeed({ collection: 'articles' }).build((err, files) => {
      expect(files['index.xml'].contents.toString())
        .to.contain('&lt;p&gt;Article 2 content.&lt;/p&gt;')
      done();
    });
  });

  it('should limit entries', done => {
    metalfeed({ collection: 'articles', limit: 1 }).build((err, files) => {
      readxml(files['index.xml'].contents.toString(), (err, result) => {
        expect(result.feed.entry).to.have.length(1)
          .and.to.have.deep.property('0.title.0', 'Article 1');
        done();
      });
    });
  });
});
