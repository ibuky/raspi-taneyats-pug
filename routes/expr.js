var express    = require('express');
var request    = require('request');
var FeedParser = require('feedparser');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fp      = new FeedParser();
  var req_rss = request('http://feeds.feedburner.com/hatena/b/hotentry.css');
  var meta  = null;
  var items = []; // RSS格納用
  
  req_rss.on('response', function(res_rss) {
    this.pipe(fp);
  });

  fp.on('readable', function() {
    meta = this.meta;
    while (item = this.read()) {
      items.push({
        'title': item.title,
        'link':  item.link,
      });
    }
  });

  fp.on('end', function() {
    console.log(items);
    res.render('expr', {'meta':meta, 'items':items});
  });
});

module.exports = router;
