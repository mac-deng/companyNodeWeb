/*var settings = require('../setting'); 
var Db = require('mongodb').Db; 
var Connection = require('mongodb').Connection; 
var Server = require('mongodb').Server; 
module.exports = new Db(settings.db, new Server(settings.host, Connection.DEFAULT_PORT, {}));
*/
var settings = require('../setting');
var mongoskin = require('mongoskin');
var bands = mongoskin.db(settings.host);
module.exports = bands;


var mongodb = require('./db'); 
var bands = mongodb.collection('bands');
var cacheSource = null;
var fs = require("fs");
updateSource();
//var util = require("util");
//var localSourceLen = 0;

/*bands.count(function(err, count) {
    console.log('There are ' + count + ' bands in the database');
});*/
function Post(username, post, time) { 
  this.user = username; 
  this.post = post;
if (time) { 
    this.time = time; 
  } else { 
    this.time = new Date(); 
  } 
}; 

module.exports = Post; 
Post.prototype.save = function save(callback) { 
}; 
Post.get = function get(macth, callback, limit) {

  var sourceList = [];
  var sourceMacth = macth ? {id:{$gt:macth*10}} : {};
  limit  = limit ? limit : 10

  bands.find(sourceMacth).limit(limit).toArray(function (err, posts) {

     /* if(cacheSource){
        callback(err, cacheSource);
        return
      }*/
      //localSourceLen = posts.length;

      /*fs.writeFile(__dirname+'/source.json', JSON.stringify(posts),function (err, data) {
        if (err) throw err;
      });*/


      cacheSource = posts;
      callback(err, posts);
    
  });
};


function Iteration(data, count, max){
    var leng = data.length;
    var number = leng/max;
    var slice = count + max;
    data.slice(count,slice).forEach(function(source,index){
      source.id= ++count;
      bands.insert(source);
    })

    

    if(count >= leng)
      return

    setTimeout(function(){Iteration(data, slice, max)},0)
    }

function updateSource(){
    var max=50;
    var count = 0;

  fs.readFile(__dirname+'/source.json', "utf8",function (err, data) {
    if (err) throw err;
    var data = eval(data);
    bands.drop();
    Iteration(data, count, max)
  });
}      var mongodb = require('./db'); 
var users = mongodb.collection("users");

function User(user) { 

  	this.name = user.name; 
	this.password = user.password; 
}; 

module.exports = User; 

User.prototype.save = function save(callback) { 
  // 存入 Mongodb 的文档
  var user = { 
    name: this.name, 
    password: this.password, 
  }; 

  users.insert(user,function(err,data){
      if (err) { 
        return callback(err); 
      } 

      callback(err, user); 
  })
}; 
User.get = function get(username, callback) { 

   users.find({name:username}).toArray(function (err, doc) {

      if (err) {  
        return callback(err); 
      } 

      if (doc.length) { 
          var user = new User(doc[0]); 
          callback(err, user); 
        } else { 
          callback(err, null); 
        } 
    
  });
}; 
