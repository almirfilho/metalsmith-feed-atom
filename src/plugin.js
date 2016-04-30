const build = require('./atom').build;


const defaults = {
  limit: 10,
  metadata: {},
  destination: 'index.xml'
};


module.exports = options => {
  options = options || {};

  if(!options.collection) throw new Error('`collection` option is required.');

  const limit = options.limit || defaults.limit;
  const feedmetadata = options.metadata || defaults.metadata;
  const destination = options.destination || defaults.destination;

  return function(files, metalsmith, done){
    var metadata = metalsmith.metadata();

    if(!metadata.collections)
      throw new Error('there are no collections configured - see metalsmith-collections plugin.');

    if(!(options.collection in metadata.collections))
      throw new Error(`the collection '${options.collection}' does not exist.`);

    const items = metadata.collections[options.collection].slice(0, limit);
    const atom = build(feedmetadata, items, destination);

    files[destination] = { contents: new Buffer(atom, 'utf-8') };
    done();
  };
};
