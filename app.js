
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var url = require("url")
var partials = require('express-partials');//引用模版模块
var flash = require('connect-flash');//引入闪存模块
var MongoStore = require('connect-mongo')(express); //数据库
var settings = require('./setting');
var fs = require('fs');
var accessLogfile = fs.createWriteStream('access.log', {flags: 'a'});
var errorLogfile = fs.createWriteStream('error.log', {flags: 'a'});
var logentries = require('node-logentries');//启用logentries日志服务
var log = logentries.logger({
  token:'process.env.LOGENTRIES_TOKEN'
});



var app = express();

app.configure(function(){

  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.logger({stream: accessLogfile}));//错误日志
  app.use(express.favicon());
  app.use(partials());//引用模版
  app.use(flash());//引用闪存
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser()); 
  app.use(express.session({ 
    secret: settings.cookieSecret,
    store: new MongoStore({ 
      db: settings.db 
    }) 
  })); 

  app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.active = req.flash('active');
    res.locals.user = req.session.user;
    res.locals.csrf = req.session ? req.session._csrf : '';
    res.locals.req = req;
    res.locals.session = req.session;

    res.locals.page = req.url.match("page") ?  req.url.split("/")[2] : 0;//翻页

    next();
  });
  
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router)
});

app.configure('production', function(){ 
  app.use(express.errorHandler());
  app.error(function (err, req, res, next) { 
  var meta = '[' + new Date() + '] ' + req.url + '\n';
  errorLogfile.write(meta + err.stack + '\n'); 
  next(); 
  }); 
});

app.configure('development', function(){
app.use(function (err, req, res, next) {
  errorLogfile.write(err.stack + '\n'); 
  console.error(err.stack);
  next(err);
})

log.info("I'm a Lumberjack and I'm OK")


log.log("debug", {sleep:"all night", work:"all day"})
});

routes(app);//express 3.0 路由器兼容


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
