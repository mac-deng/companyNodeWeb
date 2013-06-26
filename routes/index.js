var url = require("url");
var data;

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      active:'home'
    });
  });

  app.get('/:module', function(req, res) {
    res.render(req.params.module, {
      active:'home'
    });
  });

  app.get('/request/jsonp', function(req, res) {//跨域demo，jsonp接口
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(url.parse(req.url,true).query.callback+'({status:"1",content:"jsonp content"})'); // req.url
  });
  

}
