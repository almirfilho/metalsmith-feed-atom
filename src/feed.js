const XmlBuilder = require('xml2js').Builder;


const defaults = {
  destination: 'index.xml'
};


module.exports = options => {
  options = options || {};

  if(!options.collection) throw new Error('`collection` option is required.');

  destination = options.destination || defaults.destination;

  return function(files, metalsmith, done){
    var metadata = metalsmith.metadata();

    if(!metadata.collections)
      throw new Error('there are no collections configured - see metalsmith-collections plugin.');

    if(!(options.collection in metadata.collections))
      throw new Error(`the collection '${options.collection}' does not exist.`);

    var feed = {
      '$': {
        xmlns: 'http://www.w3.org/2005/Atom'
      },
      id: '',
      title: '',
      // subtitle: '',
      updated: '',
      link: [{
        '$': {
          rel: 'self',
          href: ''
        }
      }, {
        '$': {
          href: ''
        }
      }]
    };

    var builder = new XmlBuilder({xmldec: {encoding: 'utf-8', standalone: false}, rootName: 'feed'});
    var xml = builder.buildObject(feed);

    files[destination] = { contents: new Buffer(xml, 'utf-8') };

    done();
  };
};
