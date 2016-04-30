# metalsmith-feed-atom

> A [metalsmith][metal] plugin to generate Atom feed for a collection.  
> If you're looking for RSS standard instead of Atom, take a look on
> [metalsmith-feed][feed] plugin.

Requires [metalsmith-collections][collections] plugin to work.


## Usage

```javascript
const metalsmith = require('metalsmith');
const collections = require('metalsmith-collections');
const atomfeed = require('metalsmith-feed-atom');

metalsmith('working/dir')
  .use(collections({articles: '*.html'}))
  .use(atomfeed({collection: 'articles'})) // make sure it comes after collections
```


## Options

- `collection` __string__ _required_: Name of the configured
  metalsmith-collection to build the feed from.
- `limit` __number__ _optional_: Maximum number of files to show in the feed.
  Defaults to 10.
- `destination` __string__ _optional_: File path to write the rendered XML feed.
  Defaults to 'index.xml'.
- `metadata` __object__ _optional_: Metadata containing important information
  about your feed. Despite it isn't a required option, you must provide it in
  order to generate a valid Atom feed.
  - `metadata.title` __string__ _required_: Title of your site/feed.
  - `metadata.subtitle` __string__ _optional_: Subtitle of your site/feed.
  - `metadata.url` __string__ _required_: Url of your site. This is also used as
    base url to produce files (feed entries) urls.
  - `metadata.updated` __datetime__ _optional_: Last time your feed was updated.
    Defaults to the moment you generate it.

Files __must__ have `path` metadata (perhaps from
[metalsmith-permalinks][permalinks]) in order to have its links outputted in the
generated XML file.


## Contributing

Fork this repo, install the dependecies, run the tests, submit a pull request.

```bash
$ cd metalsmith-feed-atom
$ npm install
$ grunt test
```

### No grunt? No problem

You can run any grunt task just with npm scripts: `npm run grunt -- <taskname>`.
Same as `grunt test`:

```bash
$ npm run grunt -- test
```

### Automated workflow

You can keep the tests running automaticaly every time you make any change to 
the code with `dev` workflow:

```bash
$ grunt dev
$ npm run grunt -- dev
```

Always implement tests for whatever you're adding to the project. Thanks!


## License

[MIT][license] © Almir Filho


[metal]: http://www.metalsmith.io/
[feed]: https://github.com/hurrymaplelad/metalsmith-feed
[collections]: https://github.com/segmentio/metalsmith-collections
[permalinks]: https://github.com/segmentio/metalsmith-permalinks
[license]: https://github.com/almirfilho/metalsmith-feed-atom/blob/master/LICENSE.md
