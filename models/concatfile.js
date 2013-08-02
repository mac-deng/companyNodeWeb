module.exports = function(files, onConcated){
  var fs = require('fs');
  var fileList = ["db.js","post.js","user.js"];
  var EventEmitter = require('events').EventEmitter;  
  var event = new EventEmitter(); 
  var str= '';
  var i = 0; 

  event.on('concat_file',function(){
      if(!!fileList[i]){
        fs.readFile(__dirname+"/"+fileList[i], function (err, data) {
          if (err) 
            throw err;
          else 
            str+=data;

          i++;
          event.emit('concat_file');
        });
      }else{
        onConcated && onConcated(str);
        event.emit('write_file');
      }
       
  });

  event.on('write_file',function(){  
    fs.writeFile(__dirname+'/dbcopy.js', str, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  });

  event.emit('concat_file'); 
};

