const XmlBuilder = require('xml2js').Builder;
const url = require('url');


const build = function(feedmetadata, items, destination){
  var builder = new XmlBuilder({
    rootName: 'feed',
    xmldec: {
      encoding: 'utf-8',
      standalone: false
    }
  });
  return builder.buildObject(feeddata(feedmetadata, items, destination));
};


const feeddata = function(metadata, items, feedfile){
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
  feed.entry = items.map(entrydata.bind(null, { url: metadata.url }));

  return feed;
};


const entrydata = (metadata, item) => {
  var entry = { title: item.title };

  if(metadata.url){
    entry.id = url.resolve(metadata.url, item.path || '');
    entry.link = { '$': { href: entry.id } };
  }

  if(item.date) entry.updated = item.date.toISOString();

  if(item.author){
    entry.author = {};
    if(item.author.name) entry.author.name = item.author.name;
    if(item.author.uri) entry.author.uri = item.author.uri;
    if(item.author.email) entry.author.email = item.author.email;
  }

  entry.content = item.contents.toString();
  return entry;
};


module.exports = {
  build: build,
  feeddata: feeddata,
  entrydata: entrydata
};
