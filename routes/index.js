var url = require("url");
var config = require("./../config.js");

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      active:'home',
      title:config.title
    });
  });

  app.get('/:module', function(req, res) {
    res.render(req.params.module, {
      active:'home',
      title:config.title
    });
  });
  app.get('/:path/:file', function(req, res) {
    res.render(req.params.path+"/"+req.params.file, {
      active:'工具',
      layout:"demolayout",
      title:config.title
    });
  });

  app.get('/request/jsonp', function(req, res) {//跨域demo，jsonp接口
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(url.parse(req.url,true).query.callback+'({status:"1",content:"jsonp content"})'); // req.url
  });
  

}
