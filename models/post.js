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
}      