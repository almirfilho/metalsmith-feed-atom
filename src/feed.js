const XmlBuilder = require('xml2js').Builder;
const url = require('url');


const defaults = {
  destination: 'index.xml'
};


module.exports = options => {
  options = options || {};

  if(!options.collection) throw new Error('`collection` option is required.');

  const feedmetadata = options.metadata || {};
  const destination = options.destination || defaults.destination;

  return function(files, metalsmith, done){
    var metadata = metalsmith.metadata();

    if(!metadata.collections)
      throw new Error('there are no collections configured - see metalsmith-collections plugin.');

    if(!(options.collection in metadata.collections))
      throw new Error(`the collection '${options.collection}' does not exist.`);

    var builder = new XmlBuilder({xmldec: {encoding: 'utf-8', standalone: false}, rootName: 'feed'});
    var xml = builder.buildObject(feeddata(feedmetadata, destination));

    files[destination] = { contents: new Buffer(xml, 'utf-8') };

    done();
  };
};


const feeddata = function(metadata, feedfile){
  var feed = { '$': { xmlns: 'http://www.w3.org/2005/Atom' } };

  if(metadata.url){
    feed.id = metadata.url;
    feed.link = [
      { '$': { href: metadata.url } },
      { '$': { href: url.resolve(metadata.url, feedfile), rel: 'self' } }
    ];
  }

  if(metadata.title) feed.title = metadata.title;
  if(metadata.subtitle) feed.subtitle = metadata.subtitle;
  feed.updated = metadata.updated || new Date().toISOString();

  return feed;
};
