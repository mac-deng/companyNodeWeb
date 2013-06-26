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


