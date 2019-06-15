var express    = require('express');
var request    = require('request');
var FeedParser = require('feedparser');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var fp      = new FeedParser();
  var meta    = null;
  var items   = [];

  var req_rss = request('http://feeds.feedburner.com/hatena/b/hotentry.css');

  // リクエスト時の処理
  req_rss.on('response', function(res_rss) {
    this.pipe(fp);  // 処理を渡す
  });

  // RSSフィードパース時の処理
  fp.on('readable', function() {
    meta = this.meta;
    while (item = this.read()) {
      items.push({
        'title': item.title,
        'link':  item.link,
      });
    }
  });

  // RSSフィードパース終了時の処理
  fp.on('end', function() {
    res.render('expr', {'meta':meta, 'items':items});
  });
});

module.exports = router;
