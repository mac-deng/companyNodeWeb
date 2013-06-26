var mongodb = require('./db'); 
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
