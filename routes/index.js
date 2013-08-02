var url = require("url");
var config = require("./../config.js");
var concatFile = require("./../models/test.js");

module.exports = function(app) {
  app.get('/', function(req, res, next) {
    res.render('index', {
      active:'home',
      title:config.title
    });
    next();
  });

  app.get('/:module', function(req, res, next) {
    res.render(req.params.module, {
      active:'home',
      title:config.title
    });
    next();
  });

  app.get('/request/jsonp', function(req, res, next) {//跨域demo，jsonp接口
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(url.parse(req.url,true).query.callback+'({status:"1",content:"jsonp content"})'); // req.url
  });

  app.get('/build/XT.js', function(req, res, next) {//跨域demo，jsonp接口
    res.writeHead(200, {'Content-Type': 'text/plain'});
    concatFile(function(message){
      res.end(message); // req.url
    })
  });
  app.get('/:path/:file', function(req, res, next) {
    res.render(req.params.path+"/"+req.params.file, {
      active:'工具',
      layout:"demolayout",
      title:config.title
    });
    next();
  });

  

  app.all('*', function(req, res, next) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('404'); // req.url
    next();
  });

}
